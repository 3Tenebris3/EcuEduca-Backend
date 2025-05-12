import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { UserService } from "../services/user.service";
import {
  ALLOWED_AVATARS,
  AvatarKey,
  CreateUserDTO,
  UpdateUserDTO,
} from "../domain/dtos/user.dto";

export class UserController {
  /* ---------- perfil propio ---------- */
  /**
   * @openapi
   * /users/me:
   *   get:
   *     summary: Obtiene el perfil del usuario autenticado
   *     tags: [Usuarios]
   *     security: [ bearerAuth: [] ]
   *     responses:
   *       200:
   *         description: Perfil del usuario autenticado
   *       404:
   *         description: Usuario no encontrado
   */
  static async me(req: Request, res: Response) {
    const user = await UserService.getUserById((req as any).userId);
    if (!user)
      return res.status(404).json(createResponse(false, 404, "User not found"));
    const { password, ...profile } = user as any;
    res.json(createResponse(true, 200, "User profile", profile));
  }

  /* ---------- CRUD por admin ---------- */
  /**
   * @openapi
   * /users:
   *   post:
   *     summary: Crea un nuevo usuario
   *     tags: [Usuarios]
   *     security: [ bearerAuth: [] ]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserDTO'
   *     responses:
   *       201:
   *         description: Usuario creado exitosamente
   *       400:
   *         description: Error de validación
   */
  static async create(req: Request, res: Response) {
    try {
      const doc = await UserService.createUser(req.body as CreateUserDTO);
      res.status(201).json(createResponse(true, 201, "User created", doc));
    } catch (e: any) {
      res
        .status(400)
        .json(
          createResponse(false, 400, "Error", null, { details: e.message })
        );
    }
  }

  /**
   * @openapi
   * /users/{userId}:
   *   get:
   *     summary: Obtiene un usuario por ID
   *     tags: [Usuarios]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: userId
   *         in: path
   *         required: true
   *         description: ID del usuario
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Usuario encontrado
   *       404:
   *         description: Usuario no encontrado
   */
  static async getById(req: Request, res: Response) {
    const doc = await UserService.getUserById(req.params.userId);
    doc
      ? res.json(createResponse(true, 200, "OK", doc))
      : res.status(404).json(createResponse(false, 404, "Not found"));
  }

  /**
   * @openapi
   * /users/{userId}:
   *   put:
   *     summary: Actualiza un usuario existente
   *     tags: [Usuarios]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: userId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserDTO'
   *     responses:
   *       200:
   *         description: Usuario actualizado
   */
  static async update(req: Request, res: Response) {
    const doc = await UserService.updateUser(
      req.params.userId,
      req.body as UpdateUserDTO
    );
    res.json(createResponse(true, 200, "Updated", doc));
  }

  /**
   * @openapi
   * /users/{userId}:
   *   delete:
   *     summary: Elimina un usuario
   *     tags: [Usuarios]
   *     security: [ bearerAuth: [] ]
   *     parameters:
   *       - name: userId
   *         in: path
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Usuario eliminado
   */
  static async delete(req: Request, res: Response) {
    await UserService.deleteUser(req.params.userId);
    res.json(createResponse(true, 200, "Deleted"));
  }

  /**
   * @openapi
   * /users:
   *   get:
   *     summary: Lista todos los usuarios
   *     tags: [Usuarios]
   *     security: [ bearerAuth: [] ]
   *     responses:
   *       200:
   *         description: Lista de usuarios
   */
  static async getAll(_: Request, res: Response) {
    res.json(createResponse(true, 200, "OK", await UserService.getAllUsers()));
  }

  /**
   * @openapi
   * /users/me/avatar:
   *   post:
   *     summary: Actualiza el avatar del usuario autenticado
   *     tags: [Usuarios]
   *     security: [ bearerAuth: [] ]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               avatar:
   *                 type: string
   *                 enum: [avatar1.png, avatar2.png, avatar3.png, avatar4.png, avatar5.png, avatar6.png, avatar7.png, avatar8.png, avatar9.png, avatar10.png, avatar11.png, avatar12.png, avatar13.png, avatar14.png, avatar15.png, avatar16.png, avatar17.png, avatar18.png, avatar19.png, avatar20.png]
   *     responses:
   *       200:
   *         description: Avatar actualizado exitosamente
   *       400:
   *         description: Avatar no permitido
   */
  static async updateAvatar(req: Request, res: Response) {
    const uid = (req as any).userId;
    const { avatar } = req.body as { avatar: string };

    if (!ALLOWED_AVATARS.includes(avatar as any)) {
      return res
        .status(400)
        .json(createResponse(false, 400, "Avatar no permitido"));
    }

    const doc = await UserService.setAvatar(uid, avatar as AvatarKey);
    const { password, ...clean } = doc as any; // nunca exponer hash
    res.json(createResponse(true, 200, "Avatar actualizado", clean));
  }

  /** POST /users/me/change-password */
  /**
   * @openapi
   * /users/me/change-password:
   *   post:
   *     summary: Cambia la contraseña del usuario autenticado
   *     tags: [Usuarios]
   *     security: [ bearerAuth: [] ]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required: [oldPwd, newPwd]
   *             properties:
   *               oldPwd:
   *                 type: string
   *               newPwd:
   *                 type: string
   *     responses:
   *       200:
   *         description: Contraseña actualizada exitosamente
   *       400:
   *         description: Contraseña actual incorrecta
   */
  static async changeMyPassword(req: Request, res: Response) {
    const uid = (req as any).userId;
    const { oldPwd, newPwd } = req.body;

    const ok = await UserService.changePassword(uid, oldPwd, newPwd);
    if (!ok)
      return res
        .status(400)
        .json(createResponse(false, 400, "Contraseña actual incorrecta"));

    res.json(createResponse(true, 200, "Contraseña actualizada"));
  }

  /** GET /users/me/teacher */
  /**
   * @openapi
   * /users/me/teacher:
   *   get:
   *     summary: Obtiene el profesor asignado al usuario autenticado
   *     tags: [Usuarios]
   *     security: [ bearerAuth: [] ]
   *     responses:
   *       200:
   *         description: Profesor asignado encontrado
   *       404:
   *         description: No se encontró profesor asignado
   */
  static async getMyTeacher(req: Request, res: Response) {
    const uid = (req as any).userId;
    const doc = await UserService.getTeacherOfStudent(uid);
    if (!doc)
      return res
        .status(404)
        .json(createResponse(false, 404, "No se encontró profesor"));
    const { password, ...clean } = doc as any;
    res.json(createResponse(true, 200, "OK", { teacher: clean }));
  }

  /** GET /users/me/students */
  /**
   * @openapi
   * /users/me/students:
   *   get:
   *     summary: Lista de estudiantes asignados al profesor autenticado
   *     tags: [Usuarios]
   *     security: [ bearerAuth: [] ]
   *     responses:
   *       200:
   *         description: Lista de estudiantes
   *       403:
   *         description: Solo disponible para profesores
   */
  static async getMyStudents(req: Request, res: Response) {
    const uid = (req as any).userId;
    const me = await UserService.getUserById(uid);
    if (!me || !me.roles.includes("teacher"))
      return res
        .status(403)
        .json(createResponse(false, 403, "Solo para profesores"));

    const list = await UserService.getStudentsOfTeacher(uid);
    const clean = list.map((s: any) => {
      const { password, ...rest } = s;
      return rest;
    });
    res.json(createResponse(true, 200, "OK", { students: clean }));
  }
}
