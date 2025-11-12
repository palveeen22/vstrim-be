import prisma from '../../prisma';
import AppError from '../../libs/app-error';

type QuestionType = 'single' | 'multiple';

interface Option {
  id: string;
  label: string;
  icon: string | null;
}

// interface SubmitQuizAnswer {
//   questionId: string;
//   selectedOptions: (string | { id: string })[];
// }

// shared/types/quiz.types.ts
export interface SubmitQuizAnswer {
  questionId: string; // Real DB ID
  selectedOptions: string[]; // Array of option IDs
}

export interface SubmitQuizRequest {
  answers: SubmitQuizAnswer[]; // Always an array
}

interface Question {
  id: string;
  title: string;
  description: string | null;
  type: QuestionType;
  options: Option[];
}

interface DailyQuizResponse {
  questions: Question[];
  refreshAt: Date;
  expiresAt: Date;
}

export interface SubmitQuizPayload {
  answers: {
    questionId: string;
    selectedOptions: string[];
  }[];
}

export interface DailyQuiz {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date;
  date: Date;
  isActive: boolean;
}

interface SubmitQuizResponse {
  isCompleted: boolean;
  dailyQuizId: string;
  totalQuestions: number;
  answeredQuestions: number;
  completedAt: Date;
  message: string;
}

interface QuizCompletionStatus {
  isCompleted: boolean;
  completedAt: string | null;
  dailyQuizId: string | null;
  totalQuestions: number;
  answeredQuestions: number;
}

// Get today's quiz
const today = new Date();
today.setHours(0, 0, 0, 0);

class DailyQuizService {
  private static DAILY_QUESTIONS_COUNT = 5;
  private static REFRESH_HOUR = 10;

  // In-memory cache (gunakan Redis di production)
  private static cache: {
    questions: Question[] | null;
    refreshAt: Date | null;
    cachedDate: string | null;
  } = {
      questions: null,
      refreshAt: null,
      cachedDate: null,
    };


  private static getCurrentDateString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  private static getNextRefreshTime(): Date {
    const now = new Date();
    const nextRefresh = new Date();

    // Set to today at 10 AM
    nextRefresh.setHours(this.REFRESH_HOUR, 0, 0, 0);

    // If current time is past 10 AM, set to tomorrow at 10 AM
    if (now >= nextRefresh) {
      nextRefresh.setDate(nextRefresh.getDate() + 1);
    }

    return nextRefresh;
  }


  private static needsRefresh(): boolean {
    const currentDate = this.getCurrentDateString();
    const now = new Date();
    const currentHour = now.getHours();

    // Refresh if no cache exists
    if (!this.cache.questions || !this.cache.refreshAt || !this.cache.cachedDate) {
      return true;
    }

    // Refresh if it's a new day and past 10 AM
    if (this.cache.cachedDate !== currentDate && currentHour >= this.REFRESH_HOUR) {
      return true;
    }

    // Refresh if current time is past the scheduled refresh time
    if (now >= this.cache.refreshAt) {
      return true;
    }

    return false;
  }

 
  private static async getQuestionsCount(): Promise<number> {
    return await prisma.quizQuestion.count();
  }


  private static async fetchRandomQuestions(): Promise<Question[]> {
    const totalCount = await this.getQuestionsCount();

    if (totalCount < this.DAILY_QUESTIONS_COUNT) {
      throw new AppError(
        500,
        `Not enough questions in database. Need at least ${this.DAILY_QUESTIONS_COUNT}`,
        500
      );
    }

    // ✅ OPTION 1: Use Prisma ORM (Recommended - Type Safe)
    // Get all question IDs, shuffle, and take N
    const allQuestions = await prisma.quizQuestion.findMany({
      select: { id: true }
    });

    // Shuffle array
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const selectedIds = shuffled.slice(0, this.DAILY_QUESTIONS_COUNT).map(q => q.id);

    // Fetch full question data with options
    const questionsWithOptions = await prisma.quizQuestion.findMany({
      where: {
        id: { in: selectedIds }
      },
      include: {
        options: {
          select: {
            id: true,
            label: true,
            icon: true,
          },
        },
      },
    });

    return questionsWithOptions.map(question => ({
      id: question.id,
      title: question.title,
      description: question.description,
      type: question.type as QuestionType,
      options: question.options,
    }));
  }


  private static async refreshCache(): Promise<void> {
    console.log('🔄 Refreshing daily quiz cache...');

    const questions = await this.fetchRandomQuestions();
    const nextRefresh = this.getNextRefreshTime();
    const currentDate = this.getCurrentDateString();

    this.cache = {
      questions,
      refreshAt: nextRefresh,
      cachedDate: currentDate,
    };

    console.log(`✅ Daily quiz refreshed. Next refresh at: ${nextRefresh.toLocaleString()}`);
  }


  static async getDailyQuiz(userId?: string): Promise<DailyQuizResponse & { completionStatus?: QuizCompletionStatus }> {
    if (this.needsRefresh()) {
      await this.refreshCache();
    }

    if (!this.cache.questions || !this.cache.refreshAt) {
      throw new AppError(500, 'Failed to load daily quiz', 500);
    }

    const response: DailyQuizResponse & { completionStatus?: QuizCompletionStatus } = {
      questions: this.cache.questions,
      refreshAt: this.cache.refreshAt,
      expiresAt: this.cache.refreshAt,
    };

    // ✅ Include completion status if userId provided
    if (userId) {
      response.completionStatus = await this.checkTodayCompletion(userId);
    }

    return response;
  }

  // static async getTodayQuiz(): Promise<DailyQuiz | null> {
  //   const quiz = await prisma.dailyQuiz.findFirst({
  //     where: {
  //       date: today,
  //       isActive: true,
  //     },
  //   });

  //   return quiz;
  // }


  static async submitQuiz(
    userId: string,
    answers: SubmitQuizAnswer[]
  ): Promise<SubmitQuizResponse> {
    try {
      console.log(answers, "<<<<ANS");
      
      // 1. Validate input
      if (!answers || answers.length === 0) {
        throw new Error('No answers provided');
      }

      // 🔧 FIX: Type-safe flattening with explicit typing
      const flatAnswers = answers.map(answer => {
        const options = answer.selectedOptions as (string | { id: string })[];
        
        return {
          questionId: answer.questionId,
          selectedOptions: options.map(opt => {
            if (typeof opt === 'object' && opt !== null && 'id' in opt) {
              return opt.id;
            }
            return opt as string;
          })
        };
      });

      console.log(flatAnswers, "<<<<FLATTENED");

      // 2. Verify all questions exist
      const questionIds = flatAnswers.map(a => a.questionId);
      const questions = await prisma.quizQuestion.findMany({
        where: { id: { in: questionIds } }
      });

      console.log(`Found ${questions.length} questions out of ${questionIds.length}`);

      if (questions.length !== questionIds.length) {
        const foundIds = new Set(questions.map(q => q.id));
        const missingIds = questionIds.filter(id => !foundIds.has(id));
        throw new Error(
          `Some questions not found. Missing IDs: ${missingIds.join(', ')}`
        );
      }

      // 3. Check if user already completed today's quiz
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let dailyQuiz = await prisma.dailyQuiz.findFirst({
        where: {
          userId,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        }
      });

      // ✅ Prevent duplicate submissions
      if (dailyQuiz && dailyQuiz.isCompleted) {
        return {
          isCompleted: true,
          dailyQuizId: dailyQuiz.id,
          totalQuestions: flatAnswers.length,
          answeredQuestions: flatAnswers.length,
          completedAt: dailyQuiz.createdAt,
          message: 'Quiz already completed today'
        };
      }

      // 4. Create new quiz if doesn't exist
      if (!dailyQuiz) {
        dailyQuiz = await prisma.dailyQuiz.create({
          data: {
            userId,
            isCompleted: false
          }
        });
      }

      // 5. Save answers (delete old ones first to prevent duplicates)
      await prisma.quizAnswer.deleteMany({
        where: {
          dailyQuizId: dailyQuiz.id,
          questionId: { in: questionIds }
        }
      });

      // 6. Create new answers with flattened option IDs
      await prisma.quizAnswer.createMany({
        data: flatAnswers.map(answer => ({
          userId,
          dailyQuizId: dailyQuiz.id,
          questionId: answer.questionId,
          selectedIds: answer.selectedOptions,
          answeredAt: new Date()
        }))
      });

      // 7. Mark quiz as completed
      const updatedQuiz = await prisma.dailyQuiz.update({
        where: { id: dailyQuiz.id },
        data: { isCompleted: true }
      });

      // 8. Return response with ISO string for completedAt
      return {
        isCompleted: updatedQuiz.isCompleted,
        dailyQuizId: updatedQuiz.id,
        totalQuestions: flatAnswers.length,
        answeredQuestions: flatAnswers.length,
        completedAt: updatedQuiz.createdAt, // Will be serialized to ISO string by Express
        message: 'Quiz submitted successfully'
      };

    } catch (error) {
      console.error('Submit quiz error:', error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to submit quiz'
      );
    }
  }

  static async getUserLatestAnswers(userId: string) {
    const latestSession = await prisma.quizSession.findFirst({
      where: {
        userId,
        completedAt: { not: null }
      },
      orderBy: {
        completedAt: 'desc'
      },
      include: {
        answers: {
          include: {
            question: {
              select: {
                id: true,
                title: true,
                category: true,
                weight: true
              }
            },
            selectedOptions: {
              select: {
                id: true,
                label: true,
                value: true,
                vibes: true
              }
            }
          }
        },
        quiz: {
          select: {
            date: true,
            title: true
          }
        }
      }
    });

    return latestSession;
  }

static async checkTodayCompletion(userId: string): Promise<QuizCompletionStatus> {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Find today's quiz completion for this user
      const dailyQuiz = await prisma.dailyQuiz.findFirst({
        where: {
          userId,
          createdAt: {
            gte: today,
            lt: tomorrow
          }
        },
        include: {
          answers: {
            select: {
              id: true,
              questionId: true
            }
          }
        }
      });

      if (!dailyQuiz) {
        return {
          isCompleted: false,
          completedAt: null,
          dailyQuizId: null,
          totalQuestions: this.DAILY_QUESTIONS_COUNT,
          answeredQuestions: 0
        };
      }

      return {
        isCompleted: dailyQuiz.isCompleted,
        completedAt: dailyQuiz.isCompleted ? dailyQuiz.createdAt.toISOString() : null,
        dailyQuizId: dailyQuiz.id,
        totalQuestions: this.DAILY_QUESTIONS_COUNT,
        answeredQuestions: dailyQuiz.answers.length
      };

    } catch (error) {
      console.error('Check today completion error:', error);
      throw new AppError(500, 'Failed to check quiz completion status', 500);
    }
  }

  static async hasCompletedToday(userId: string): Promise<boolean> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayQuiz = await prisma.dailyQuiz.findFirst({
      where: {
        date: today,
        isActive: true
      }
    });

    if (!todayQuiz) {
      return false;
    }

    const session = await prisma.quizSession.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId: todayQuiz.id
        }
      },
      select: {
        completedAt: true
      }
    });

    return session?.completedAt !== null;
  }

  // static async getUserQuizHistory(userId: string, limit: number = 10) {
  //   return await prisma.quizSession.findMany({
  //     where: {
  //       userId,
  //       completedAt: { not: null }
  //     },
  //     orderBy: {
  //       completedAt: 'desc'
  //     },
  //     take: limit,
  //     select: {
  //       id: true,
  //       completedAt: true,
  //       quiz: {
  //         select: {
  //           date: true,
  //           title: true
  //         }
  //       },
  //       answers: {
  //         select: {
  //           question: {
  //             select: {
  //               title: true
  //             }
  //           },
  //           selectedOptions: {
  //             select: {
  //               label: true
  //             }
  //           }
  //         }
  //       }
  //     }
  //   });
  // }


  static async forceRefresh(): Promise<DailyQuizResponse> {
    await this.refreshCache();
    return this.getDailyQuiz();
  }

 
  static clearCache(): void {
    this.cache = {
      questions: null,
      refreshAt: null,
      cachedDate: null,
    };
  }


  static initializeScheduler(): void {
    console.log('📅 Initializing daily quiz scheduler...');

    // Initial refresh
    this.refreshCache().catch(err => {
      console.error('Failed to initialize daily quiz:', err);
    });

    // Schedule next refresh
    const scheduleNextRefresh = () => {
      const now = new Date();
      const nextRefresh = this.getNextRefreshTime();
      const msUntilRefresh = nextRefresh.getTime() - now.getTime();

      console.log(`⏰ Next daily quiz refresh scheduled for: ${nextRefresh.toLocaleString()}`);

      setTimeout(() => {
        this.refreshCache()
          .then(() => {
            scheduleNextRefresh();
          })
          .catch(err => {
            console.error('Failed to refresh daily quiz:', err);
            setTimeout(scheduleNextRefresh, 60 * 60 * 1000);
          });
      }, msUntilRefresh);
    };

    scheduleNextRefresh();
  }
}

export default DailyQuizService;