import { Router } from 'express';
import { UnitController } from '../controllers/unit.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';
import { authorize } from '../middlewares/role.middleware';

/**
 * mergeParams:true  → hereda :classId del router padre
 */
export const unitRouter = Router({ mergeParams: true });
unitRouter.use(jwtAuthMiddleware);

/* Crear unidad (admin/teacher) */
unitRouter.post('/', authorize('admin', 'teacher'), UnitController.create);

/* Listar todas las unidades de la clase */
unitRouter.get('/', UnitController.getAll);

/* CRUD por ID de unidad */
unitRouter.get('/:unitId', UnitController.getById);
unitRouter.put('/:unitId', authorize('admin', 'teacher'), UnitController.update);
unitRouter.delete('/:unitId', authorize('admin', 'teacher'), UnitController.delete);
