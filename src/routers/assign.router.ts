import { Router } from 'express';
import { AssignController } from '../controllers/assign.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';
import { authorize } from '../middlewares/role.middleware';

export const assignRouter = Router();
assignRouter.use(jwtAuthMiddleware, authorize('admin', 'teacher'));

/* Estudiantes */
assignRouter.post  ('/classes/:cId/students/:sId', AssignController.addStudent);
assignRouter.delete('/classes/:cId/students/:sId', AssignController.removeStudent);

/* Maestros */
assignRouter.post  ('/classes/:cId/teachers/:tId', AssignController.addTeacher);
assignRouter.delete('/classes/:cId/teachers/:tId', AssignController.removeTeacher);
