import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createResponse } from '../utils/response.util';

const JWT_SECRET = process.env.JWT_SECRET || 'my_jwt_secreto';

/**
 * Middleware que verifica la validez de un token JWT.
 */
export function jwtAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json(
      createResponse(false, 401, 'No token provided', null, {
        details: 'Missing Authorization header'
      })
    );
    return;
  }
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    (req as any).userId = decoded.userId;
    (req as any).userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json(
      createResponse(false, 401, 'Invalid token', null, { details: String(error) })
    );
    return;
  }
}
