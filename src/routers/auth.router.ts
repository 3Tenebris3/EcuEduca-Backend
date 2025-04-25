import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { jwtAuthMiddleware } from '../middlewares/jwtAuth.middleware';

/**
 * authRouter
 * Define los endpoints públicos para autenticación.
 * Endpoints:
 *  - POST /auth/login   --> Inicia sesión.
 *  - POST /auth/register   --> Registra un nuevo usuario.
 */
export const authRouter = Router();

authRouter.post('/login', AuthController.login);
authRouter.post('/register', AuthController.register);
authRouter.post('/logout', jwtAuthMiddleware, AuthController.logout);