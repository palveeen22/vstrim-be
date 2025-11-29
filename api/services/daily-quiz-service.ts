import prisma from '../../prisma';
import AppError from '../../libs/app-error';

type QuestionType = 'single' | 'multiple';

interface Option {
  id: string;
  label: string;
  icon: string | null;
}
export interface SubmitQuizAnswer {
  questionId: string;
  selectedOptions: string[];
}

export interface SubmitQuizRequest {
  answers: SubmitQuizAnswer[];
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
  user?: any
}

interface QuizCompletionStatus {
  isCompleted: boolean;
  completedAt: string | null;
  dailyQuizId: string | null;
  totalQuestions: number;
  answeredQuestions: number;
  user?: any
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

    // OPTION 1: Use Prisma ORM (Recommended - Type Safe)
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

  // DailyQuizService.ts
  static async submitQuiz(
    userId: string,
    answers: SubmitQuizAnswer[]
  ): Promise<SubmitQuizResponse> {
    try {
      console.log('📥 Received answers:', answers);

      // 1️⃣ Validasi input
      if (!answers || answers.length === 0) {
        throw new Error('No answers provided');
      }

      // 2️⃣ Flatten jawaban agar aman
      const flatAnswers = answers.map(answer => {
        const options = answer.selectedOptions as (string | { id: string })[];
        return {
          questionId: answer.questionId,
          selectedOptions: options.map(opt =>
            typeof opt === 'object' && opt !== null && 'id' in opt ? opt.id : (opt as string)
          ),
        };
      });

      // 3️⃣ Pastikan semua questionId valid
      const questionIds = flatAnswers.map(a => a.questionId);
      const questions = await prisma.quizQuestion.findMany({
        where: { id: { in: questionIds } },
      });

      if (questions.length !== questionIds.length) {
        const foundIds = new Set(questions.map(q => q.id));
        const missingIds = questionIds.filter(id => !foundIds.has(id));
        throw new Error(`Some questions not found: ${missingIds.join(', ')}`);
      }

      // 4️⃣ Cek apakah user sudah menyelesaikan quiz hari ini
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let dailyQuiz = await prisma.dailyQuiz.findFirst({
        where: {
          userId,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      if (dailyQuiz && dailyQuiz.isCompleted) {
        return {
          isCompleted: true,
          dailyQuizId: dailyQuiz.id,
          totalQuestions: flatAnswers.length,
          answeredQuestions: flatAnswers.length,
          completedAt: dailyQuiz.createdAt,
          message: 'Quiz already completed today',
        };
      }

      // 5️⃣ Buat daily quiz baru jika belum ada
      if (!dailyQuiz) {
        dailyQuiz = await prisma.dailyQuiz.create({
          data: { userId, isCompleted: false },
        });
      }

      // 6️⃣ Hapus jawaban lama jika ada
      await prisma.quizAnswer.deleteMany({
        where: { dailyQuizId: dailyQuiz.id, questionId: { in: questionIds } },
      });

      // 7️⃣ Simpan jawaban baru
      await prisma.quizAnswer.createMany({
        data: flatAnswers.map(answer => ({
          userId,
          dailyQuizId: dailyQuiz.id,
          questionId: answer.questionId,
          selectedIds: answer.selectedOptions,
          answeredAt: new Date(),
        })),
      });

      // 8️⃣ Tandai quiz sebagai completed
      const updatedQuiz = await prisma.dailyQuiz.update({
        where: { id: dailyQuiz.id },
        data: { isCompleted: true },
      });

      // 9️⃣ Tambahkan +100 token ke user dan ambil data lengkap
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          tokens: { increment: 100 },
        },
        include: {
          dailyQuizzes: {
            include: {
              answers: {
                include: {
                  question: {
                    include: {
                      options: true
                    }
                  }
                }
              }
            }
          },
          communities: {
            include: {
              community: true
            }
          },
          hangoutPlaces: true,
          coordinates: true,
        },
      });

      console.log(`🎉 User ${userId} gained +100 tokens! Total: ${updatedUser.tokens}`);

      // 🔟 Return response lengkap
      return {
        isCompleted: updatedQuiz.isCompleted,
        dailyQuizId: updatedQuiz.id,
        totalQuestions: flatAnswers.length,
        answeredQuestions: flatAnswers.length,
        completedAt: updatedQuiz.createdAt,
        message: 'Quiz submitted successfully. +100 tokens rewarded!',
        user: updatedUser,
      };
    } catch (error) {
      console.error('❌ Submit quiz error:', error);
      throw new Error(
        error instanceof Error ? error.message : 'Failed to submit quiz'
      );
    }
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