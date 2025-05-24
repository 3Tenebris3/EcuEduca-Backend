import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { UserController } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.use(jwtAuthMiddleware);

userRouter.get("/me",                   UserController.me);
userRouter.patch("/me/avatar",          UserController.avatar);
userRouter.post("/me/change-password",          UserController.changePwd); // path matches front
userRouter.get("/me/teacher",     UserController.myTeacher);
userRouter.get("/me/students",    UserController.myStudents);
