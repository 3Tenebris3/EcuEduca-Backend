import { Request, Response, NextFunction } from "express";
import { createResponse } from "../utils/response.util";

/**
 * Devuelve un middleware que solo permite acceso si el usuario
 * autenticado tiene alguno de los roles indicados.
 *
 *  app.post("/ruta-protegida",
 *           jwtAuthMiddleware,
 *           roleGuard("admin","teacher"),
 *           handler);
 */
export function roleGuard(...allowed: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = (req as any).userRole as string | undefined;

    if (!role || !allowed.includes(role)) {
      return res
        .status(403)
        .json(createResponse(false, 403, "Forbidden", null, {
          details: `Required roles: ${allowed.join(", ")}`,
        }));
    }
    next();
  };
}
