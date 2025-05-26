import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { FillBlankController } from "../controllers/fillblank.controller";

export const fillBlankRouter = Router();

fillBlankRouter.use(jwtAuthMiddleware);

fillBlankRouter.get("/sets",      FillBlankController.list);
fillBlankRouter.get("/sets/:id",  FillBlankController.questions);
fillBlankRouter.post("/submit",   FillBlankController.submit);
