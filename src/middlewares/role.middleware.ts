import { Request, Response, NextFunction } from 'express';
import { createResponse } from '../utils/response.util';

export const authorize = (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).userRole;
    if (!roles.includes(role)) {
      return res.status(403).json(createResponse(false, 403, 'Forbidden'));
    }
    next();
  };
