import { Request, Response } from "express";
import { createResponse } from "../utils/response.util";
import { UserService } from "../services/user.service";

/**
 * Controlador para el manejo de usuarios.
 */
export class UserController {
  /**
   * @openapi
   * /users/me:
   *   get:
   *     summary: Devuelve el perfil del usuario autenticado
   *     tags: [Usuarios]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Perfil del usuario
   *       '401':
   *         description: Token ausente o inválido
   *       '404':
   *         description: Usuario no encontrado
   */
  static async me(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).userId; // ← viene del token
      const user = await UserService.getUserById(userId);

      if (!user) {
        res.status(404).json(createResponse(false, 404, "User not found"));
        return;
      }

      const { password, ...profile } = user as any;
      res.status(200).json(createResponse(true, 200, "User profile", profile));
    } catch (err: any) {
      res.status(400).json(
        createResponse(false, 400, "Error fetching user", null, {
          details: err.message,
        })
      );
    }
  }

  /**
   * @openapi
   * /users:
   *   post:
   *     summary: Crea un nuevo usuario.
   *     security:
   *       - bearerAuth: []
   *     description: Crea un usuario en Firestore, hasheando la contraseña, y retorna el usuario creado.
   *     tags:
   *       - Usuarios
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *               password:
   *                 type: string
   *               displayName:
   *                 type: string
   *               role:
   *                 type: string
   *             required:
   *               - email
   *               - password
   *               - displayName
   *     responses:
   *       '201':
   *         description: Usuario creado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       '400':
   *         description: Error en la creación del usuario.
   */
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, displayName, role } = req.body;
      const newUser = await UserService.createUser(
        email,
        password,
        displayName,
        role
      );
      res
        .status(201)
        .json(createResponse(true, 201, "User created successfully", newUser));
    } catch (error: any) {
      res.status(400).json(
        createResponse(false, 400, "Error creating user", null, {
          details: error.message,
        })
      );
    }
  }

  /**
   * @openapi
   * /users/{userId}:
   *   get:
   *     summary: Obtiene la información de un usuario.
   *     security:
   *       - bearerAuth: []
   *     description: Retorna los datos de un usuario a partir de su ID.
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         description: Identificador único del usuario.
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Usuario obtenido correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       '404':
   *         description: Usuario no encontrado.
   *       '400':
   *         description: Error al obtener el usuario.
   */
  static async getById(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const user = await UserService.getUserById(userId);
      if (!user) {
        res.status(404).json(createResponse(false, 404, "User not found"));
        return;
      }
      res
        .status(200)
        .json(createResponse(true, 200, "User fetched successfully", user));
    } catch (error: any) {
      res.status(400).json(
        createResponse(false, 400, "Error fetching user", null, {
          details: error.message,
        })
      );
    }
  }

  /**
   * @openapi
   * /users/{userId}:
   *   put:
   *     summary: Actualiza la información de un usuario.
   *     security:
   *       - bearerAuth: []
   *     description: Permite actualizar ciertos campos de un usuario identificado por su ID.
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         description: Identificador del usuario a actualizar.
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               displayName:
   *                 type: string
   *               roles:
   *                 type: array
   *                 items:
   *                   type: string
   *               classes:
   *                 type: array
   *                 items:
   *                   type: string
   *     responses:
   *       '200':
   *         description: Usuario actualizado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       '400':
   *         description: Error al actualizar el usuario.
   */
  static async update(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const updates = req.body;
      const updatedUser = await UserService.updateUser(userId, updates);
      if (!updatedUser) {
        res.status(404).json(createResponse(false, 404, "User not found"));
        return;
      }
      res
        .status(200)
        .json(
          createResponse(true, 200, "User updated successfully", updatedUser)
        );
    } catch (error: any) {
      res.status(400).json(
        createResponse(false, 400, "Error updating user", null, {
          details: error.message,
        })
      );
    }
  }

  /**
   * @openapi
   * /users/{userId}:
   *   delete:
   *     summary: Elimina un usuario.
   *     security:
   *       - bearerAuth: []
   *     description: Borra un usuario de Firestore a partir de su ID.
   *     tags:
   *       - Usuarios
   *     parameters:
   *       - in: path
   *         name: userId
   *         required: true
   *         description: Identificador del usuario a eliminar.
   *         schema:
   *           type: string
   *     responses:
   *       '200':
   *         description: Usuario eliminado correctamente.
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ApiResponse'
   *       '400':
   *         description: Error al eliminar el usuario.
   */
  static async delete(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const deleted = await UserService.deleteUser(userId);
      if (!deleted) {
        res.status(404).json(createResponse(false, 404, "User not found"));
        return;
      }
      res
        .status(200)
        .json(createResponse(true, 200, "User deleted successfully"));
    } catch (error: any) {
      res.status(400).json(
        createResponse(false, 400, "Error deleting user", null, {
          details: error.message,
        })
      );
    }
  }

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Lista todos los usuarios
   *     tags:
   *       - Usuarios
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de usuarios
   */
  static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const user = await UserService.getAllUsers();
      res.status(200).json(createResponse(true, 200, "Fech Users", user));
    } catch (error: any) {
      res.status(400).json(
        createResponse(false, 400, "Error fetching users", null, {
          details: error.message,
        })
      );
    }
  }
}
