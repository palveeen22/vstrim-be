import { Response, Request } from 'express';
import DailyQuizService, { SubmitQuizAnswer } from '../services/daily-quiz-service';
import AppError from '../../libs/app-error';

class DailyQuizController {
  static async getDailyQuiz(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      const result = await DailyQuizService.getDailyQuiz(userId);

      console.log(result);

      return res.status(200).json({
        status: 'success',
        data: result,
        message: 'Daily quiz retrieved successfully',
      }) as Response;

    } catch (error) {
      return res.status(error instanceof AppError ? error.statusCode : 500).json({
        status: 'error',
        data: null,
        message: error instanceof Error ? error.message : 'Failed to fetch daily quiz',
      }) as Response;
    }
  }

  static async checkCompletion(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          data: null,
          message: 'Unauthorized'
        });
      }

      const completionStatus = await DailyQuizService.checkTodayCompletion(userId);

      return res.status(200).json({
        status: 'success',
        data: completionStatus,
        message: 'Quiz completion status retrieved successfully'
      });

    } catch (error) {
      console.error('Check completion error:', error);

      return res.status(500).json({
        status: 'error',
        data: null,
        message: 'Failed to check quiz completion status'
      });
    }
  }

static async submitQuiz(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      console.log(userId);

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          data: null,
          message: 'Unauthorized'
        });
      }

      const { answers } = req.body;

      console.log(answers, "<<><> RAW ANSWERS");

      // ✅ Check if answers is already an array (from your frontend)
      let answersArray: SubmitQuizAnswer[];

      if (Array.isArray(answers)) {
        // Frontend sent array format - use it directly!
        answersArray = answers.map(answer => ({
          questionId: answer.questionId,
          selectedOptions: Array.isArray(answer.selectedOptions)
            ? answer.selectedOptions
            : [answer.selectedOptions]
        }));
      } else if (answers && typeof answers === 'object') {
        // Handle object format (backup for legacy format)
        answersArray = Object.entries(answers).map(([questionId, selectedOptions]) => ({
          questionId,
          selectedOptions: Array.isArray(selectedOptions) ? selectedOptions : [selectedOptions]
        }));
      } else {
        return res.status(400).json({
          status: 'error',
          data: null,
          message: 'Invalid answers format'
        });
      }

      if (answersArray.length === 0) {
        return res.status(400).json({
          status: 'error',
          data: null,
          message: 'No answers provided'
        });
      }

      console.log('📊 Processed answers:', answersArray);

      const result = await DailyQuizService.submitQuiz(
        userId,
        answersArray
      );

      console.log('✅ Quiz submitted successfully for user:', userId);

      return res.status(200).json({
        status: 'success',
        data: result,
        message: 'Quiz completed! Your answers will help us find your perfect matches.'
      });

    } catch (error) {
      console.error('Submit quiz error:', error);

      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          data: null,
          message: error.message
        });
      }

      return res.status(500).json({
        status: 'error',
        data: null,
        message: error instanceof Error ? error.message : 'Failed to submit quiz'
      });
    }
  }


  /**
   * ✅ Get quiz history
   */
  static async getQuizHistory(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          data: null,
          message: 'Unauthorized'
        });
      }

      const limit = parseInt(req.query.limit as string) || 10;

      const history = await DailyQuizService.getUserQuizHistory(userId, limit);

      return res.status(200).json({
        status: 'success',
        data: {
          history,
          total: history.length
        },
        message: 'Quiz history retrieved successfully'
      });

    } catch (error) {
      console.error('Get quiz history error:', error);

      return res.status(500).json({
        status: 'error',
        data: null,
        message: 'Failed to retrieve quiz history'
      });
    }
  }

  /**
   * ✅ Get latest quiz answers (for matching algorithm)
   */
  static async getLatestAnswers(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          data: null,
          message: 'Unauthorized'
        });
      }

      const latestAnswers = await DailyQuizService.getUserLatestAnswers(userId);

      if (!latestAnswers) {
        return res.status(404).json({
          status: 'error',
          data: null,
          message: 'No quiz answers found. Please complete a quiz first.'
        });
      }

      return res.status(200).json({
        status: 'success',
        data: latestAnswers,
        message: 'Latest quiz answers retrieved successfully'
      });

    } catch (error) {
      console.error('Get latest answers error:', error);

      return res.status(500).json({
        status: 'error',
        data: null,
        message: 'Failed to retrieve quiz answers'
      });
    }
  }


  static async forceRefresh(res: Response): Promise<Response> {
    try {
      const result = await DailyQuizService.forceRefresh();

      return res.status(200).json({
        status: 'success',
        data: result,
        message: 'Daily quiz refreshed successfully',
      });
    } catch (error) {
      console.error('Error refreshing daily quiz:', error);

      return res.status(error instanceof AppError ? error.statusCode : 500).json({
        status: 'error',
        data: null,
        message: error instanceof Error ? error.message : 'Failed to refresh daily quiz',
      });
    }
  }
}

export default DailyQuizController;