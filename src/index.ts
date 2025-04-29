import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { authRouter } from './routers/auth.router';
import { userRouter } from './routers/user.router';
import { swaggerSpec } from './config/swagger.config';
import swaggerUi from 'swagger-ui-express';
import { classRouter } from './routers/class.router';
import { unitRouter } from './routers/unit.router';
import { moduleRouter } from './routers/module.router';
import { assignRouter } from './routers/assign.router';
import { gradeRouter } from './routers/grade.router';
import { scenarioRouter } from './routers/scenario.router';
import { minigameRouter } from './routers/minigame.router';
import { quizRouter } from './routers/quiz.router';
import { reportRouter } from './routers/report.router';

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/classes', classRouter);
app.use('/api/classes/:classId/units', unitRouter);
app.use('/api/classes/:classId/units/:unitId/modules', moduleRouter);
app.use('/api/assign', assignRouter);
app.use('/api/grades', gradeRouter);
app.use('/api/scenarios', scenarioRouter);
app.use('/api/minigames', minigameRouter);
app.use('/api/quizzes', quizRouter);
app.use('/api/reports', reportRouter);
app.use('/api/auth', authRouter);

// Configurar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Puerto y arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
