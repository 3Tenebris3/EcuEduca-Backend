import { Router } from "express";
import { TriviaController } from "../controllers/trivia.controller";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";

export const triviaRouter = Router();

triviaRouter.get("/sets",      jwtAuthMiddleware, TriviaController.list);
triviaRouter.get("/sets/:id",  TriviaController.getSet);
triviaRouter.post("/submit",   jwtAuthMiddleware, TriviaController.submit);
