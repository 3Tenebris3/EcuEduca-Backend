import { Router } from 'express';
import { ModuleController } from '../controllers/module.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';
import { authorize } from '../middlewares/role.middleware';

/* mergeParams:true para heredar classId y unitId */
export const moduleRouter = Router({ mergeParams: true });
moduleRouter.use(jwtAuthMiddleware);

moduleRouter.post('/',        authorize('admin','teacher'), ModuleController.create);
moduleRouter.get('/',                                        ModuleController.getAll);
moduleRouter.get('/:moduleId',                               ModuleController.getById);
moduleRouter.put('/:moduleId', authorize('admin','teacher'), ModuleController.update);
moduleRouter.delete('/:moduleId', authorize('admin','teacher'), ModuleController.delete);
