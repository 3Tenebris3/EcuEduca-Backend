import { Request, Response } from 'express';
import { createResponse }    from '../utils/response.util';
import { UserService }       from '../services/user.service';
import { CreateUserDTO, UpdateUserDTO } from '../domain/dtos/user.dto';

export class UserController {

  /* ---------- perfil propio ---------- */
  static async me(req: Request, res: Response) {
    const user = await UserService.getUserById((req as any).userId);
    if (!user) return res.status(404).json(createResponse(false,404,'User not found'));
    const { password, ...profile } = user as any;
    res.json(createResponse(true,200,'User profile',profile));
  }

  /* ---------- CRUD por admin ---------- */
  static async create(req:Request,res:Response){
    try{
      const doc = await UserService.createUser(req.body as CreateUserDTO);
      res.status(201).json(createResponse(true,201,'User created',doc));
    }catch(e:any){
      res.status(400).json(createResponse(false,400,'Error',null,{details:e.message}));
    }
  }

  static async getById(req:Request,res:Response){
    const doc = await UserService.getUserById(req.params.userId);
    doc ? res.json(createResponse(true,200,'OK',doc))
        : res.status(404).json(createResponse(false,404,'Not found'));
  }

  static async update(req:Request,res:Response){
    const doc = await UserService.updateUser(req.params.userId, req.body as UpdateUserDTO);
    res.json(createResponse(true,200,'Updated',doc));
  }

  static async delete(req:Request,res:Response){
    await UserService.deleteUser(req.params.userId);
    res.json(createResponse(true,200,'Deleted'));
  }

  static async getAll(_:Request,res:Response){
    res.json(createResponse(true,200,'OK',await UserService.getAllUsers()));
  }
}
