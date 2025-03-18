import { Request, Response } from 'express';
import { createResponse } from '../utils/response.util';
import { AuthService } from '../services/auth.service';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      return res.json(
        createResponse(true, 200, 'Login successful', result)
      );
    } catch (error) {
      return res.status(400).json(
        createResponse(false, 400, 'Login failed', null, { details: String(error) })
      );
    }
  }

  static async register(req: Request, res: Response, next: unknown) {
    try {
      const { email, password, role } = req.body;
      const newUser = await AuthService.register(email, password, role);
      return res.status(201).json(
        createResponse(true, 201, 'User registered', newUser)
      );
    } catch (error) {
      return res.status(400).json(
        createResponse(false, 400, 'Registration failed', null, { details: String(error) })
      );
    }
  }
}
