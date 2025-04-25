import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { authRouter } from './routers/auth.router';
import { userRouter } from './routers/user.router';
import { swaggerSpec } from './config/swagger.config';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de la API
app.use('/auth', authRouter);
app.use('/users', userRouter);

// Configurar Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Puerto y arranque del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
