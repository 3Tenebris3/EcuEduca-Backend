import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserService } from './user.service';
import { LoginDTO, RegisterDTO } from '../domain/dtos/auth.dto';

const JWT_SECRET = process.env.JWT_SECRET || 'my_jwt_secreto';

/**
 * Servicio de autenticación.
 */
export class AuthService {
  /**
   * Realiza el login comprobando las credenciales y generando un JWT.
   * @param loginDto Objeto con email y password.
   * @returns Token JWT si las credenciales son válidas.
   */
  static async login(loginDto: LoginDTO): Promise<{ token: string }> {
    const { email, password } = loginDto;
    const user = await UserService.findUserByEmail(email);
    if (!user) {
      throw new Error('User not found');
    }
    // Compara la contraseña enviada con el hash almacenado
    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      userId: user.id,
      role: user.roles[0],
      displayName: user.displayName   // opcional
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
    return { token };
  }

  /**
   * Registra un nuevo usuario.
   * @param registerDto Objeto con email, password y displayName.
   * @returns Usuario registrado.
   */
  static async register(registerDto: RegisterDTO) {
    const { email, password, displayName, role } = registerDto;
    // Comprueba si el usuario ya existe
    const existing = await UserService.findUserByEmail(email);
    if (existing) {
      throw new Error('User already exists');
    }
    const newUser = await UserService.createUser(email, password, displayName, role || 'student');
    return newUser;
  }
}
