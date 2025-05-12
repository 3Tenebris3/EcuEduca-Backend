import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { AuthService } from "../services/auth.service";
import { LoginDTO, RegisterDTO } from "../domain/dtos/auth.dto";

export class AuthController {
  /**
   * @openapi
   * /auth/login:
   *   post:
   *     summary: Autentica y devuelve un JWT
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/LoginDTO'
   *     responses:
   *       200:
   *         description: Autenticación exitosa
   *       401:
   *         description: Credenciales inválidas
   */

  static async login(req: Request, res: Response) {
    try {
      const data = await AuthService.login(req.body as LoginDTO);
      res.json(createResponse(true, 200, "Login OK", data));
    } catch (e: any) {
      res
        .status(401)
        .json(
          createResponse(false, 401, "Invalid credentials", null, {
            details: e.message,
          })
        );
    }
  }

  /**
   * @openapi
   * /auth/register:
   *   post:
   *     summary: Registra un nuevo usuario y devuelve un JWT
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/RegisterDTO'
   *     responses:
   *       201:
   *         description: Registro exitoso
   *       400:
   *         description: Error en el registro
   */
  static async register(req: Request, res: Response) {
    try {
      const data = await AuthService.register(req.body as RegisterDTO);
      res.status(201).json(createResponse(true, 201, "Registered", data));
    } catch (e: any) {
      res
        .status(400)
        .json(
          createResponse(false, 400, "Registration failed", null, {
            details: e.message,
          })
        );
    }
  }

  /** Logout (estadísticamente). El frontend solo descarta el JWT. */
  static logout(_: Request, res: Response) {
    res.json(createResponse(true, 200, "Logged out"));
  }
}
