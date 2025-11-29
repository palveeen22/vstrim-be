import { Router } from 'express';
import { authenticate } from '../middlewares';
import DailyQuizController from '../controllers/daily-quiz-controller';

const router = Router();
// ✅ Get daily quiz (with optional completion status if authenticated)
router.get('/daily-quiz', authenticate, DailyQuizController.getDailyQuiz);

// ✅ NEW: Check today's completion status
router.get('/daily-quiz/completion', authenticate, DailyQuizController.checkCompletion);

// ✅ Submit quiz answers
router.post('/daily-quiz/submit', authenticate, DailyQuizController.submitQuiz);

// Force refresh (admin only)
router.post('/daily-quiz/refresh', authenticate, DailyQuizController.forceRefresh);

export default router;