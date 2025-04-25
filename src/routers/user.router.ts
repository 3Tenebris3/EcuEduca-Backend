// src/routes/user.router.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';

export const userRouter = Router();

/* ---------- rutas que dependen del token ---------- */
userRouter.get('/me',      jwtAuthMiddleware, UserController.me);

/* CRUD (típicamente solo para admin) */
userRouter.post('/',       jwtAuthMiddleware, UserController.create);
userRouter.get('/:userId', jwtAuthMiddleware, UserController.getById);
userRouter.put('/:userId', jwtAuthMiddleware, UserController.update);
userRouter.delete('/:userId', jwtAuthMiddleware, UserController.delete);
userRouter.get('/',        jwtAuthMiddleware, UserController.getAll);
