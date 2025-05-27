import cors from 'cors';
import morgan from "morgan";
import express from 'express';
import winston from "winston";
import * as dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { authRouter } from './routers/auth.router';
import { userRouter } from './routers/user.router';
import { quizRouter } from './routers/quiz.router';
import { unitRouter } from './routers/unit.router';
import { gradeRouter } from './routers/grade.router';
import { swaggerSpec } from './config/swagger.config';
import { moduleRouter } from './routers/module.router';
import { scenarioRouter } from './routers/scenario.router';
import { minigameRouter } from './routers/minigame.router';
import { leaderboardRouter } from './routers/leaderboard.router';
import { notificationRouter } from './routers/notification.router';
import { rewardRouter } from './routers/reward.router';
import { fillBlankRouter } from './routers/fillblank.router';
import { memoryRouter } from './routers/memory.router';
import { quickPickRouter } from './routers/quickpick.router';
import { sequenceRouter } from './routers/sequence.router';
import { triviaRouter } from './routers/trivia.router';
import { teacherRouter } from './routers/teacher.router';
import { progressRouter } from './routers/progress.router';
import { teacherPointsRouter } from './routers/teacherPoints.router';
import { classRouter } from './routers/class.router';

dotenv.config();

const app = express();
const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "api.log" }),
  ],
  format: winston.format.json(),
});

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/grades', gradeRouter);
app.use('/quizzes', quizRouter);
app.use("/rewards", rewardRouter);
app.use("/teacher",  teacherRouter);
app.use("/progress", progressRouter);
app.use('/scenarios', scenarioRouter);
app.use('/minigames', minigameRouter);
app.use("/admin/classes", classRouter);
app.use("/minigames/trivia", triviaRouter);
app.use("/minigames/memory", memoryRouter);
app.use("/leaderboard",   leaderboardRouter);
app.use('/notifications', notificationRouter);
app.use("/minigames/sequence", sequenceRouter);
app.use('/classes/:classId/units', unitRouter);
app.use("/teacher/points", teacherPointsRouter);
app.use("/minigames/quickpick", quickPickRouter);
app.use("/minigames/fillblank", fillBlankRouter);
app.use('/classes/:classId/units/:unitId/modules', moduleRouter);

// Configurar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Puerto y arranque del servidor
//const PORT = parseInt(process.env.PORT || '3000', 10);
//app.listen(PORT, '0.0.0.0', () => {
//  console.log(`Backend listening on port ${PORT}`);
//  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
//});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  })
);

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API is healthy",
    timestamp: new Date().toISOString(),
  });
});


app.listen(3000, '0.0.0.0', () => {
  console.log(`Backend listening on port 3000`);
  console.log(`Swagger docs available at http://localhost:3000/api-docs`);
});
