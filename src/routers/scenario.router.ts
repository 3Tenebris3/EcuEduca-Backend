import { Router } from 'express';
import { ScenarioController } from '../controllers/scenario.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';
import { authorize } from '../middlewares/role.middleware';

export const scenarioRouter = Router();
scenarioRouter.use(jwtAuthMiddleware);

/* ----- Escenarios base ----- */
scenarioRouter.post('/',          authorize('admin','teacher'), ScenarioController.create);
scenarioRouter.get('/',                                            ScenarioController.getAll);
scenarioRouter.get('/:scenarioId',                                 ScenarioController.getById);
scenarioRouter.put('/:scenarioId', authorize('admin','teacher'), ScenarioController.update);
scenarioRouter.delete('/:scenarioId', authorize('admin'),        ScenarioController.delete);

/* ----- Puntos de interés ----- */
scenarioRouter.post('/:scenarioId/points',
                    authorize('admin','teacher'), ScenarioController.addPoint);

scenarioRouter.get('/:scenarioId/points',
                    ScenarioController.listPoints);

scenarioRouter.put('/:scenarioId/points/:pointId',
                    authorize('admin','teacher'), ScenarioController.updatePoint);

scenarioRouter.delete('/:scenarioId/points/:pointId',
                    authorize('admin','teacher'), ScenarioController.deletePoint);
