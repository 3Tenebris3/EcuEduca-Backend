import { Router } from "express";
import { QuizController } from "../controllers/quiz.controller";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";

export const quizRouter = Router();

quizRouter.use(jwtAuthMiddleware);

quizRouter.get("/sets",           QuizController.list);
quizRouter.get("/sets/:id",       QuizController.questions);
quizRouter.post("/submit",        QuizController.submit);
