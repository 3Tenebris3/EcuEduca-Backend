import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/login', async (req, res, next) => {
	try {
		await AuthController.login(req, res);
	} catch (error) {
		next(error);
	}
});
authRouter.post('/register', async (req, res, next) => {
	try {
		await AuthController.register(req, res, next);
	} catch (error) {
		next(error);
	}
});
// Estas rutas NO tienen middleware JWT (acceso libre).
