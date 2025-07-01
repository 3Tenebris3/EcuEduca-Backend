import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { roleGuard }         from "../middlewares/roleGuard.middleware";
import { TriviaController }  from "../controllers/trivia.controller";

export const triviaRouter = Router();

/* ---------- alumno ---------- */
triviaRouter.use("/sets", jwtAuthMiddleware);          // proteger abajo

triviaRouter.get("/sets",      TriviaController.list);
triviaRouter.get("/sets/:id",  TriviaController.getSet);
triviaRouter.post("/submit",   jwtAuthMiddleware, TriviaController.submit);

/* ---------- admin CRUD ---------- */
triviaRouter.post(
  "/admin/sets",
  jwtAuthMiddleware,
  roleGuard("admin"),
  TriviaController.createSet,
);

triviaRouter.patch(
  "/admin/sets/:id",
  jwtAuthMiddleware,
  roleGuard("admin"),
  TriviaController.patchSet,
);

triviaRouter.delete(
  "/admin/sets/:id",
  jwtAuthMiddleware,
  roleGuard("admin"),
  TriviaController.deleteSet,
);

triviaRouter.post(
  "/admin/sets/:id/questions",
  jwtAuthMiddleware,
  roleGuard("admin"),
  TriviaController.addQuestion,
);

triviaRouter.patch(
  "/admin/sets/:id/questions/:qid",
  jwtAuthMiddleware,
  roleGuard("admin"),
  TriviaController.patchQuestion,
);

triviaRouter.delete(
  "/admin/sets/:id/questions/:qid",
  jwtAuthMiddleware,
  roleGuard("admin"),
  TriviaController.deleteQuestion,
);
