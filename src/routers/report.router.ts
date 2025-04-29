import { Router } from 'express';
import { ReportController } from '../controllers/report.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';
import { authorize } from '../middlewares/role.middleware';

export const reportRouter = Router();
reportRouter.use(jwtAuthMiddleware);

/* lectura: cualquier usuario autenticado (docente ve dashboard) */
reportRouter.get('/', ReportController.get);

/* reconstruir: solo admin */
reportRouter.post('/rebuild', authorize('admin'), ReportController.rebuild);
