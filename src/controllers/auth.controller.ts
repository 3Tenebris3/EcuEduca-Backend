import { Request, Response } from 'express';
import { createResponse } from '../utils/response.util';
import { AuthService } from '../services/auth.service';
import { RegisterDTO } from '../domain/dtos/auth.dto';

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Realiza el login del usuario
 *     description: Recibe credenciales y devuelve un token JWT si son válidas
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       '200':
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Credenciales inválidas
 *
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     description: Crea un nuevo usuario con los datos proporcionados
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               displayName:
 *                type: string
 *               role:
 *                type: string
 *                enum: [student, teacher, admin, parent]
 *             required:
 *               - email
 *               - password
 *               - displayName
 *               - role
 *     responses:
 *       '201':
 *         description: Usuario registrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       '400':
 *         description: Error al registrar
 */
export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const loginDto = req.body;
      const result = await AuthService.login(loginDto);
      res.status(200).json(createResponse(true, 200, 'Login successful', result));
    } catch (error: any) {
      res.status(400).json(createResponse(false, 400, 'Login failed', null, { details: error.message }));
    }
  }

  static async register(req: Request, res: Response): Promise<void> {
    try {
      const registerDto = req.body;
      const newUser = await AuthService.register(registerDto);
      res.status(201).json(createResponse(true, 201, 'User registered', newUser));
    } catch (error: any) {
      res.status(400).json(createResponse(false, 400, 'Registration failed', null, { details: error.message }));
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    // No hay token que invalidar, solo responde con éxito
    res.status(200).json(
      createResponse(true, 200, 'Logout successful', null)
    );
  }
}
