import { Router } from "express";
import { QuizController } from "../controllers/quiz.controller";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";

export const quizRouter = Router();

quizRouter.use(jwtAuthMiddleware);

quizRouter.get("/sets",           QuizController.list);
quizRouter.get("/sets/:id",       QuizController.questions);
quizRouter.post("/submit",        QuizController.submit);

/* sets */
quizRouter.post("/sets",           QuizController.createSet);
quizRouter.patch("/sets/:id",      QuizController.updateSet);
quizRouter.delete("/sets/:id",     QuizController.deleteSet);

/* preguntas */
quizRouter.post(
  "/sets/:id/questions",
  QuizController.addQuestion,
);
quizRouter.patch(
  "/sets/:id/questions/:qid",
  QuizController.updateQuestion,
);
quizRouter.delete(
  "/sets/:id/questions/:qid",
  QuizController.deleteQuestion,
);