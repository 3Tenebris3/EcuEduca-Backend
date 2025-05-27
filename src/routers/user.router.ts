import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { roleGuard } from "../middlewares/roleGuard.middleware";
import { UserController } from "../controllers/user.controller";

export const userRouter = Router();

/* ─── Rutas autenticadas ─── */
userRouter.use(jwtAuthMiddleware);

/* Perfil propio (cualquier rol) */
userRouter.get("/me",                UserController.me);
userRouter.patch("/me/avatar",       UserController.avatar);
userRouter.post( "/me/change-password", UserController.changePwd);
userRouter.get( "/me/teacher",       UserController.myTeacher);
userRouter.get( "/me/students",      UserController.myStudents);

/* CRUD solo para admins */
userRouter.get(   "/",               roleGuard("admin"), UserController.list);
userRouter.get(   "/role/:role",     roleGuard("admin"), UserController.listByRole);
userRouter.get(   "/:id",            roleGuard("admin"), UserController.get);
userRouter.post(  "/",               roleGuard("admin"), UserController.create);
userRouter.patch( "/:id",            roleGuard("admin"), UserController.update);
userRouter.delete("/:id",            roleGuard("admin"), UserController.remove);

/* Asignar profesor (admin o el propio teacher) */
userRouter.post(
  "/:id/assign-teacher",
  roleGuard(...["admin", "teacher"]),
  UserController.assignTeacher,
);
