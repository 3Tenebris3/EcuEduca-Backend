import "express";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;      // lo añade jwtAuthMiddleware
    userRole?: string;
  }
}