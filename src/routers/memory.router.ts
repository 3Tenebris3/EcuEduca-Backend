import { Router } from "express";
import { jwtAuthMiddleware } from "../middlewares/jwtAuth.middleware";
import { MemoryController } from "../controllers/memory.controller";

export const memoryRouter = Router();

memoryRouter.use(jwtAuthMiddleware);

memoryRouter.get("/sets",        MemoryController.list);
memoryRouter.get("/sets/:id",    MemoryController.pairs);
memoryRouter.post("/submit",     MemoryController.submit);
