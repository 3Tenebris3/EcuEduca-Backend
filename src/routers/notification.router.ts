import { Router } from 'express';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';
import { NotificationController } from '../controllers/notification.controller';

export const notificationRouter = Router();

notificationRouter.use(jwtAuthMiddleware);

notificationRouter.get('/',            NotificationController.list);
notificationRouter.get('/:id',         NotificationController.detail);
notificationRouter.post('/',           NotificationController.create);
notificationRouter.post('/:id/read',   NotificationController.markRead);
notificationRouter.delete('/:id',      NotificationController.remove);
