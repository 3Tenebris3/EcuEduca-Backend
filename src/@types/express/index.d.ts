import "express";

declare module "express-serve-static-core" {
  interface Request {
    /** añadido por middleware verifyJWT */
    user?: {
      uid: string;
      name: string;
      avatar: string;
    };
  }
}
