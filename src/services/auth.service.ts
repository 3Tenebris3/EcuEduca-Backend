import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserService }   from './user.service';
import { UserModel }     from '../domain/models/user.model';
import { LoginDTO, RegisterDTO } from '../domain/dtos/auth.dto';

const JWT_SECRET      = process.env.JWT_SECRET  || 'my_jwt_secreto';
const JWT_EXPIRES_IN  = process.env.JWT_EXPIRES ? parseInt(process.env.JWT_EXPIRES, 10) : '2h';

export class AuthService {

  /* ---------- login ---------- */
  static async login({ email, password }: LoginDTO) {
    const user = await UserService.findUserByEmail(email);
    if (!user || !user.password) throw new Error('Invalid credentials');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    return this.issueToken(user);
  }

  /* ---------- register ---------- */
  static async register(dto: RegisterDTO) {
    // reutiliza UserService para creación (contraseña hasheada dentro)
    const user = await UserService.createUser(dto);
    return this.issueToken(user);
  }

  /* ---------- helpers ---------- */
  private static issueToken(user: UserModel) {
    const payload = { userId: user.id, role: user.roles[0] };
    const token   = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // nunca exponer password
    const { password, ...safeUser } = user as any;
    return { token, user: safeUser };
  }
}
