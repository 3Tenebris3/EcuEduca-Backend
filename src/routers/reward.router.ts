import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { RewardController } from "../controllers/reward.controller";

export const rewardRouter = Router();

rewardRouter.use(jwtAuthMiddleware);
rewardRouter.get("/",    RewardController.list);
rewardRouter.post("/redeem", RewardController.redeem);
