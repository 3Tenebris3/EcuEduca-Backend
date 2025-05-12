import { Request, Response }    from 'express';
import { createResponse }       from '../utils/response.util';
import { QuizService }          from '../services/quiz.service';
import { CreateAnswerDTO, CreateQuestionDTO, CreateQuizDTO, UpdateAnswerDTO, UpdateQuestionDTO, UpdateQuizDTO } from '../domain/dtos/quiz.dto';

export class QuizController {
  /* ------ quizzes ------ */
    /**
   * @openapi
   * /quizzes:
   *   post:
   *     summary: Crea un nuevo quiz
   *     tags: [Quizzes]
   *     security: [ bearerAuth: [] ]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateQuizDTO'
   *     responses:
   *       201:
   *         description: Quiz creado exitosamente
   */
  static async create(req:Request,res:Response){
    const createdBy = (req as any).userId;
    const doc = await QuizService.create({ ...req.body as CreateQuizDTO, createdBy });
    res.status(201).json(createResponse(true,201,'Quiz created',doc));
  }

    /**
   * @openapi
   * /quizzes:
   *   get:
   *     summary: Lista todos los quizzes
   *     tags: [Quizzes]
   *     responses:
   *       200:
   *         description: Lista de quizzes
   */
  static async getAll(_:Request,res:Response){
    res.json(createResponse(true,200,'OK',await QuizService.getAll()));
  }

    /**
   * @openapi
   * /quizzes/{quizId}:
   *   get:
   *     summary: Obtiene un quiz por su ID
   *     tags: [Quizzes]
   *     parameters:
   *       - in: path
   *         name: quizId
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200: { description: Quiz encontrado }
   *       404: { description: Quiz no encontrado }
   */
  static async getById(req:Request,res:Response){
    const doc=await QuizService.getById(req.params.quizId);
    doc? res.json(createResponse(true,200,'OK',doc))
       : res.status(404).json(createResponse(false,404,'Not found'));
  }

    /**
   * @openapi
   * /quizzes/{quizId}:
   *   put:
   *     summary: Actualiza un quiz
   *     tags: [Quizzes]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - in: path
   *         name: quizId
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateQuizDTO'
   *     responses:
   *       200: { description: Quiz actualizado }
   */
  static async update(req:Request,res:Response){
    const doc=await QuizService.update(req.params.quizId, req.body as UpdateQuizDTO);
    res.json(createResponse(true,200,'Updated',doc));
  }

    /**
   * @openapi
   * /quizzes/{quizId}:
   *   delete:
   *     summary: Elimina un quiz
   *     tags: [Quizzes]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - in: path
   *         name: quizId
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200: { description: Quiz eliminado }
   */
  static async delete(req:Request,res:Response){
    await QuizService.delete(req.params.quizId);
    res.json(createResponse(true,200,'Deleted'));
  }

  /* ------ questions ------ */
    /**
   * @openapi
   * /quizzes/{quizId}/questions:
   *   post:
   *     summary: Agrega una pregunta a un quiz
   *     tags: [Preguntas]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - in: path
   *         name: quizId
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateQuestionDTO'
   *     responses:
   *       201: { description: Pregunta agregada }
   */
  static async addQuestion(req:Request,res:Response){
    const doc = await QuizService.createQuestion(req.params.quizId, req.body as CreateQuestionDTO);
    res.status(201).json(createResponse(true,201,'Question added',doc));
  }
  
    /**
   * @openapi
   * /quizzes/{quizId}/questions:
   *   get:
   *     summary: Lista todas las preguntas de un quiz
   *     tags: [Preguntas]
   *     parameters:
   *       - in: path
   *         name: quizId
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200: { description: Lista de preguntas }
   */
  static async listQuestions(req:Request,res:Response){
    const list = await QuizService.getQuestions(req.params.quizId);
    res.json(createResponse(true,200,'OK',list));
  }
  
    /**
   * @openapi
   * /quizzes/{quizId}/questions/{questionId}:
   *   put:
   *     summary: Actualiza una pregunta
   *     tags: [Preguntas]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: quizId
   *         in: path
   *         required: true
   *         schema: { type: string }
   *       - name: questionId
   *         in: path
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateQuestionDTO'
   *     responses:
   *       200: { description: Pregunta actualizada }
   */
  static async updateQuestion(req:Request,res:Response){
    const doc = await QuizService.updateQuestion(
      req.params.quizId, req.params.questionId, req.body as UpdateQuestionDTO);
    res.json(createResponse(true,200,'Updated',doc));
  }
  
    /**
   * @openapi
   * /quizzes/{quizId}/questions/{questionId}:
   *   delete:
   *     summary: Elimina una pregunta de un quiz
   *     tags: [Preguntas]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: quizId
   *         in: path
   *         required: true
   *         schema: { type: string }
   *       - name: questionId
   *         in: path
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200: { description: Pregunta eliminada }
   */
  static async deleteQuestion(req:Request,res:Response){
    await QuizService.deleteQuestion(req.params.quizId, req.params.questionId);
    res.json(createResponse(true,200,'Deleted'));
  }

  /* ------ answers (only multiple_choice) ------ */
    /**
   * @openapi
   * /quizzes/{quizId}/questions/{questionId}/answers:
   *   post:
   *     summary: Agrega una respuesta a una pregunta
   *     tags: [Respuestas]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - in: path
   *         name: quizId
   *         required: true
   *         schema: { type: string }
   *       - in: path
   *         name: questionId
   *         required: true
   *         schema: { type: string }
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateAnswerDTO'
   *     responses:
   *       201: { description: Respuesta agregada }
   */
  static async addAnswer(req:Request,res:Response){
    const doc=await QuizService.createAnswer(
      req.params.quizId, req.params.questionId, req.body as CreateAnswerDTO);
    res.status(201).json(createResponse(true,201,'Answer added',doc));
  }
  
    /**
   * @openapi
   * /quizzes/{quizId}/questions/{questionId}/answers:
   *   get:
   *     summary: Lista las respuestas de una pregunta
   *     tags: [Respuestas]
   *     parameters:
   *       - in: path
   *         name: quizId
   *         required: true
   *         schema: { type: string }
   *       - in: path
   *         name: questionId
   *         required: true
   *         schema: { type: string }
   *     responses:
   *       200: { description: Lista de respuestas }
   */
  static async listAnswers(req:Request,res:Response){
    const list=await QuizService.getAnswers(req.params.quizId, req.params.questionId);
    res.json(createResponse(true,200,'OK',list));
  }
  
    /**
   * @openapi
   * /quizzes/{quizId}/questions/{questionId}/answers/{answerId}:
   *   put:
   *     summary: Actualiza una respuesta
   *     tags: [Respuestas]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: quizId
   *         in: path
   *         required: true
   *       - name: questionId
   *         in: path
   *         required: true
   *       - name: answerId
   *         in: path
   *         required: true
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateAnswerDTO'
   *     responses:
   *       200: { description: Respuesta actualizada }
   */
  static async updateAnswer(req:Request,res:Response){
    const doc=await QuizService.updateAnswer(
      req.params.quizId, req.params.questionId, req.params.answerId, req.body as UpdateAnswerDTO);
    res.json(createResponse(true,200,'Updated',doc));
  }
  
    /**
   * @openapi
   * /quizzes/{quizId}/questions/{questionId}/answers/{answerId}:
   *   delete:
   *     summary: Elimina una respuesta de una pregunta
   *     tags: [Respuestas]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: quizId
   *         in: path
   *         required: true
   *       - name: questionId
   *         in: path
   *         required: true
   *       - name: answerId
   *         in: path
   *         required: true
   *     responses:
   *       200: { description: Respuesta eliminada }
   */
  static async deleteAnswer(req:Request,res:Response){
    await QuizService.deleteAnswer(req.params.quizId, req.params.questionId, req.params.answerId);
    res.json(createResponse(true,200,'Deleted'));
  }
}
