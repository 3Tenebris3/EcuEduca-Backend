import { Router } from "express";
import { QuizController } from "../controllers/quiz.controller";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { authorize } from "../middlewares/role.middleware";

export const quizRouter = Router();
quizRouter.use(jwtAuthMiddleware);

/* ── CRUD Quizzes ───────────────────────────── */
quizRouter.post("/", authorize("admin", "teacher"), QuizController.create);
quizRouter.get("/", QuizController.getAll);
quizRouter.get("/:quizId", QuizController.getById);
quizRouter.put(
  "/:quizId",
  authorize("admin", "teacher"),
  QuizController.update
);
quizRouter.delete("/:quizId", authorize("admin"), QuizController.delete);

/* ── Preguntas ─────────────────────────────── */
quizRouter.post(
  "/:quizId/questions",
  authorize("admin", "teacher"),
  QuizController.addQuestion
);
quizRouter.get("/:quizId/questions", QuizController.listQuestions);
quizRouter.put(
  "/:quizId/questions/:questionId",
  authorize("admin", "teacher"),
  QuizController.updateQuestion
);
quizRouter.delete(
  "/:quizId/questions/:questionId",
  authorize("admin", "teacher"),
  QuizController.deleteQuestion
);

/* ── Intentos de Quiz ───────────────────────── */
quizRouter.post("/:quizId/attempts", QuizController.startAttempt);
quizRouter.get("/:quizId/attempts/me", QuizController.myAttempts);
quizRouter.post(
  "/:quizId/attempts/:attemptId/submit",
  QuizController.submitAttempt
);
