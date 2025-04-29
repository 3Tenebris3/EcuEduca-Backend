import { CreateQuizDTO, UpdateQuizDTO, CreateQuestionDTO, UpdateQuestionDTO, CreateAnswerDTO, UpdateAnswerDTO } from '../domain/dtos/quiz.dto';
import { FirebaseService } from './firebase.service';
const COL = 'quizzes';

export class QuizService {
  /* ---------- quizzes ---------- */
  static create(dto: CreateQuizDTO & { createdBy: string }) {
    const data = { ...dto, createdAt: new Date(), updatedAt: new Date(), isActive: true };
    return FirebaseService.createDoc(COL, data);
  }
  static getAll()               { return FirebaseService.getCollection(COL); }
  static getById(id:string)     { return FirebaseService.getDocById(COL, id); }
  static update(id:string, dto: UpdateQuizDTO){
    dto.updatedAt = new Date();
    return FirebaseService.updateDoc(COL, id, dto);
  }
  static delete(id:string)      { return FirebaseService.deleteDoc(COL, id); }

  /* ---------- preguntas ---------- */
  private static qPath(qId: string) { return `${COL}/${qId}/questions`; }

  static createQuestion(qId: string, dto: CreateQuestionDTO) {
    dto.createdAt = new Date();
    return FirebaseService.createDoc(this.qPath(qId), dto);
  }
  static getQuestions(qId:string) { return FirebaseService.getCollection(this.qPath(qId)); }
  static updateQuestion(qId:string,quesId:string,dto:UpdateQuestionDTO){
    return FirebaseService.updateDoc(this.qPath(qId), quesId, dto);
  }
  static deleteQuestion(qId:string,quesId:string){
    return FirebaseService.deleteDoc(this.qPath(qId), quesId);
  }

  /* ---------- answers (multiple_choice) ---------- */
  private static aPath(qId:string,quesId:string){
    return `${COL}/${qId}/questions/${quesId}/answers`;
  }
  static createAnswer(qId:string,quesId:string,dto:CreateAnswerDTO){
    return FirebaseService.createDoc(this.aPath(qId,quesId), dto);
  }
  static getAnswers(qId:string,quesId:string){
    return FirebaseService.getCollection(this.aPath(qId,quesId));
  }
  static updateAnswer(qId:string,quesId:string,ansId:string,dto:UpdateAnswerDTO){
    return FirebaseService.updateDoc(this.aPath(qId,quesId), ansId, dto);
  }
  static deleteAnswer(qId:string,quesId:string,ansId:string){
    return FirebaseService.deleteDoc(this.aPath(qId,quesId), ansId);
  }
}
