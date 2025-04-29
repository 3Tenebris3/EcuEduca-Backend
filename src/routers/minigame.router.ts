import { Router } from 'express';
import { MinigameController } from '../controllers/minigame.controller';
import { jwtAuthMiddleware }  from '../middlewares/jwtAuth.middleware';
import { authorize }          from '../middlewares/role.middleware';

export const minigameRouter = Router();
minigameRouter.use(jwtAuthMiddleware);

/* CRUD */
minigameRouter.post('/', authorize('admin','teacher'), MinigameController.create);
minigameRouter.get('/',                                        MinigameController.getAll);
minigameRouter.get('/:minigameId',                             MinigameController.getById);
minigameRouter.put('/:minigameId', authorize('admin','teacher'), MinigameController.update);
minigameRouter.delete('/:minigameId', authorize('admin'),       MinigameController.delete);
