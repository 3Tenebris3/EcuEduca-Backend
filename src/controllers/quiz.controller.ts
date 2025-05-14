import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { QuizService } from "../services/quiz.service";

import {
  CreateQuizDTO,
  UpdateQuizDTO,
  CreateQuestionDTO,
  UpdateQuestionDTO,
  CreateAttemptDTO,
  SubmitQuizDTO,
} from "../domain/dtos/quiz.dto";

/* util p/ extraer param ↔ evitar repetir `req.params.xxx` */
const param = (req: Request, name: string) => req.params[name];

/* ────────────────────────────────────────────────────────── */
export class QuizController {
  /* ── CRUD de Quiz ─────────────────────────────────────── */
  static async create(req: Request, res: Response) {
    try {
      const dto = req.body as CreateQuizDTO;
      const createdBy = (req as any).userId;
      const doc = await QuizService.create({ ...dto, createdBy });
      res.status(201).json(createResponse(true, 201, "Quiz creado", doc));
    } catch (e: any) {
      res
        .status(400)
        .json(
          createResponse(false, 400, "Error", null, { details: e.message })
        );
    }
  }

  static async getAll(_: Request, res: Response) {
    const list = await QuizService.getAll();
    res.json(createResponse(true, 200, "OK", list));
  }

  static async getById(req: Request, res: Response) {
    const doc = await QuizService.getById(param(req, "quizId"));
    doc
      ? res.json(createResponse(true, 200, "OK", doc))
      : res.status(404).json(createResponse(false, 404, "No encontrado"));
  }

  static async update(req: Request, res: Response) {
    const doc = await QuizService.update(
      param(req, "quizId"),
      req.body as UpdateQuizDTO
    );
    res.json(createResponse(true, 200, "Actualizado", doc));
  }

  static async delete(req: Request, res: Response) {
    await QuizService.delete(param(req, "quizId"));
    res.json(createResponse(true, 200, "Eliminado"));
  }

  /* ── Preguntas ────────────────────────────────────────── */
  static async addQuestion(req: Request, res: Response) {
    const quizId = param(req, "quizId");
    const doc = await QuizService.createQuestion(
      quizId,
      req.body as CreateQuestionDTO
    );
    res.status(201).json(createResponse(true, 201, "Pregunta añadida", doc));
  }

  static async listQuestions(req: Request, res: Response) {
    const list = await QuizService.getQuestions(param(req, "quizId"));
    res.json(createResponse(true, 200, "OK", list));
  }

  static async updateQuestion(req: Request, res: Response) {
    const { quizId, questionId } = req.params;
    const doc = await QuizService.updateQuestion(
      quizId,
      questionId,
      req.body as UpdateQuestionDTO
    );
    res.json(createResponse(true, 200, "Pregunta actualizada", doc));
  }

  static async deleteQuestion(req: Request, res: Response) {
    const { quizId, questionId } = req.params;
    await QuizService.deleteQuestion(quizId, questionId);
    res.json(createResponse(true, 200, "Pregunta eliminada"));
  }

  /* ── Intentos ─────────────────────────────────────────── */
  /* ── Intentos ─────────────────────────────────────────── */
  static async startAttempt(req: Request, res: Response) {
    try {
      /* dto base */
      const dto: CreateAttemptDTO = {
        ...req.body,
        userId: (req as any).userId,
        quizId: req.params.quizId,
        startedAt: new Date(),
      };

      /* número de preguntas = tamaño de la colección */
      const questions = await QuizService.getQuestions(dto.quizId);
      dto.answers = new Array(questions.length).fill(-1); // -1 = sin responder

      const attempt = await QuizService.startAttempt(dto);
      res
        .status(201)
        .json(createResponse(true, 201, "Intento iniciado", attempt));
    } catch (e: any) {
      res
        .status(400)
        .json(
          createResponse(false, 400, "Error", null, { details: e.message })
        );
    }
  }

  static async submitAttempt(req: Request, res: Response) {
    try {
      const result = await QuizService.submit(req.body as SubmitQuizDTO);
      res.json(createResponse(true, 200, "Resultado", result));
    } catch (e: any) {
      res
        .status(400)
        .json(
          createResponse(false, 400, "Error", null, { details: e.message })
        );
    }
  }

  static async myAttempts(req: Request, res: Response) {
    const list = await QuizService.getMyAttempts(
      (req as any).userId,
      param(req, "quizId")
    );
    res.json(createResponse(true, 200, "OK", list));
  }
}
