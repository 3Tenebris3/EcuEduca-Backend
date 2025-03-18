import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createResponse } from '../utils/response.util';

const JWT_SECRET = process.env.JWT_SECRET || 'my_jwt_secret';

/**
 * Middleware que valida si la petición trae un token JWT.
 * Si no, retorna error. Si sí, añade userId y role a req.
 */
export function jwtAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json(
      createResponse(false, 401, 'No token provided', null, { details: 'Missing Authorization header' })
    );
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    (req as any).userId = decoded.userId;
    (req as any).userRole = decoded.role;
    next();
  } catch (error) {
    return res.status(401).json(
      createResponse(false, 401, 'Invalid token', null, { details: String(error) })
    );
  }
}
