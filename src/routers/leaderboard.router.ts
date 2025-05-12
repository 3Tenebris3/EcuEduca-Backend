import { Router } from 'express';
import { jwtAuthMiddleware }  from '../middlewares/jwtAuth.middleware';
import { LeaderboardController } from '../controllers/leaderboard.controller';

export const leaderboardRouter = Router();
leaderboardRouter.use(jwtAuthMiddleware);

/* CRUD */
leaderboardRouter.get('/', LeaderboardController.leaderboardMine);
