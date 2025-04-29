import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';
import { authorize } from '../middlewares/role.middleware';

export const userRouter = Router();

/* públicas para auth/register las manejas en auth.router.ts (no incluidas aquí) */

/* Rutas que requieren JWT */
userRouter.use(jwtAuthMiddleware);

/* Perfil propio */
userRouter.get('/me', UserController.me);

/* CRUD (admin) */
userRouter.post('/',             authorize('admin'), UserController.create);
userRouter.get('/',              authorize('admin'), UserController.getAll);
userRouter.get('/:userId',       authorize('admin'), UserController.getById);
userRouter.put('/:userId',       authorize('admin'), UserController.update);
userRouter.delete('/:userId',    authorize('admin'), UserController.delete);
