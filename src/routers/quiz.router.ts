import { Router } from 'express';
import { QuizController } from '../controllers/quiz.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';
import { authorize } from '../middlewares/role.middleware';

export const quizRouter = Router();
quizRouter.use(jwtAuthMiddleware);

/* quizzes CRUD */
quizRouter.post('/', authorize('admin','teacher'), QuizController.create);
quizRouter.get('/',  QuizController.getAll);
quizRouter.get('/:quizId', QuizController.getById);
quizRouter.put('/:quizId', authorize('admin','teacher'), QuizController.update);
quizRouter.delete('/:quizId', authorize('admin'), QuizController.delete);

/* questions */
quizRouter.post('/:quizId/questions', authorize('admin','teacher'), QuizController.addQuestion);
quizRouter.get('/:quizId/questions', QuizController.listQuestions);
quizRouter.put('/:quizId/questions/:questionId', authorize('admin','teacher'), QuizController.updateQuestion);
quizRouter.delete('/:quizId/questions/:questionId', authorize('admin','teacher'), QuizController.deleteQuestion);

/* answers (multiple choice) */
quizRouter.post('/:quizId/questions/:questionId/answers', authorize('admin','teacher'), QuizController.addAnswer);
quizRouter.get('/:quizId/questions/:questionId/answers', QuizController.listAnswers);
quizRouter.put('/:quizId/questions/:questionId/answers/:answerId', authorize('admin','teacher'), QuizController.updateAnswer);
quizRouter.delete('/:quizId/questions/:questionId/answers/:answerId', authorize('admin','teacher'), QuizController.deleteAnswer);
