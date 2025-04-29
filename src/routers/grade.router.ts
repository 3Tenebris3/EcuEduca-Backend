import { Router } from 'express';
import { GradeController } from '../controllers/grade.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';
import { authorize } from '../middlewares/role.middleware';

export const gradeRouter = Router();
gradeRouter.use(jwtAuthMiddleware);

/* Solo teacher o admin crean nota */
gradeRouter.post('/', authorize('teacher', 'admin'), GradeController.create);

/* Cualquier usuario autenticado puede consultar (filtrado por rol en reglas) */
gradeRouter.get('/', GradeController.list);
