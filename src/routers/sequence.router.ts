import { Router } from "express";
import { SequenceController } from "../controllers/sequence.controller";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";

export const sequenceRouter = Router();

sequenceRouter.get(
  "/sets",
  jwtAuthMiddleware,
  SequenceController.list
);
sequenceRouter.get("/sets/:id", SequenceController.getSet);
sequenceRouter.post("/submit",  jwtAuthMiddleware, SequenceController.submit);