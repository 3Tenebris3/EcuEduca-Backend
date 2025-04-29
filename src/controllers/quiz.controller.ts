import { Request, Response }    from 'express';
import { createResponse }       from '../utils/response.util';
import { QuizService }          from '../services/quiz.service';
import { CreateAnswerDTO, CreateQuestionDTO, CreateQuizDTO, UpdateAnswerDTO, UpdateQuestionDTO, UpdateQuizDTO } from '../domain/dtos/quiz.dto';

export class QuizController {
  /* ------ quizzes ------ */
  static async create(req:Request,res:Response){
    const createdBy = (req as any).userId;
    const doc = await QuizService.create({ ...req.body as CreateQuizDTO, createdBy });
    res.status(201).json(createResponse(true,201,'Quiz created',doc));
  }
  static async getAll(_:Request,res:Response){
    res.json(createResponse(true,200,'OK',await QuizService.getAll()));
  }
  static async getById(req:Request,res:Response){
    const doc=await QuizService.getById(req.params.quizId);
    doc? res.json(createResponse(true,200,'OK',doc))
       : res.status(404).json(createResponse(false,404,'Not found'));
  }
  static async update(req:Request,res:Response){
    const doc=await QuizService.update(req.params.quizId, req.body as UpdateQuizDTO);
    res.json(createResponse(true,200,'Updated',doc));
  }
  static async delete(req:Request,res:Response){
    await QuizService.delete(req.params.quizId);
    res.json(createResponse(true,200,'Deleted'));
  }

  /* ------ questions ------ */
  static async addQuestion(req:Request,res:Response){
    const doc = await QuizService.createQuestion(req.params.quizId, req.body as CreateQuestionDTO);
    res.status(201).json(createResponse(true,201,'Question added',doc));
  }
  static async listQuestions(req:Request,res:Response){
    const list = await QuizService.getQuestions(req.params.quizId);
    res.json(createResponse(true,200,'OK',list));
  }
  static async updateQuestion(req:Request,res:Response){
    const doc = await QuizService.updateQuestion(
      req.params.quizId, req.params.questionId, req.body as UpdateQuestionDTO);
    res.json(createResponse(true,200,'Updated',doc));
  }
  static async deleteQuestion(req:Request,res:Response){
    await QuizService.deleteQuestion(req.params.quizId, req.params.questionId);
    res.json(createResponse(true,200,'Deleted'));
  }

  /* ------ answers (only multiple_choice) ------ */
  static async addAnswer(req:Request,res:Response){
    const doc=await QuizService.createAnswer(
      req.params.quizId, req.params.questionId, req.body as CreateAnswerDTO);
    res.status(201).json(createResponse(true,201,'Answer added',doc));
  }
  static async listAnswers(req:Request,res:Response){
    const list=await QuizService.getAnswers(req.params.quizId, req.params.questionId);
    res.json(createResponse(true,200,'OK',list));
  }
  static async updateAnswer(req:Request,res:Response){
    const doc=await QuizService.updateAnswer(
      req.params.quizId, req.params.questionId, req.params.answerId, req.body as UpdateAnswerDTO);
    res.json(createResponse(true,200,'Updated',doc));
  }
  static async deleteAnswer(req:Request,res:Response){
    await QuizService.deleteAnswer(req.params.quizId, req.params.questionId, req.params.answerId);
    res.json(createResponse(true,200,'Deleted'));
  }
}
