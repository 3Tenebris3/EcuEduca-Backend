import { Router } from 'express';
import { ClassController } from '../controllers/class.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';
import { authorize } from '../middlewares/role.middleware';

export const classRouter = Router();
classRouter.use(jwtAuthMiddleware);

/* CRUD */
classRouter.post('/',        authorize('admin','teacher'), ClassController.create);
classRouter.get('/',                                          ClassController.getAll);
classRouter.get('/:classId',                                  ClassController.getById);
classRouter.put('/:classId', authorize('admin','teacher'), ClassController.update);
classRouter.delete('/:classId', authorize('admin'),        ClassController.delete);
