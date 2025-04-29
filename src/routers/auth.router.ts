import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';

export const authRouter = Router();

authRouter.post('/login',    AuthController.login);
authRouter.post('/register', AuthController.register);

/* logout opcional, requiere JWT para que swagger lo muestre protegido */
authRouter.post('/logout', jwtAuthMiddleware, AuthController.logout);
