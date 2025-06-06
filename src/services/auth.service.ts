import * as svc from "../services/user.service";
import { LoginDTO, RegisterDTO } from '../domain/dtos/auth.dto';
import { comparePassword, signToken } from '../utils/crypto.util';

const JWT_SECRET      = process.env.JWT_SECRET  || 'my_jwt_secreto';
const JWT_EXPIRES_IN  = process.env.JWT_EXPIRES ? parseInt(process.env.JWT_EXPIRES, 10) : '2h';

export class AuthService {

  /* ---------- login ---------- */
  static async login({ email, password }: LoginDTO) {
    const user = await svc.findByEmail(email);
    if (!user || !user.password) throw new Error('Invalid credentials');

    const match = comparePassword(password, user.password);
    if (!match) throw new Error('Invalid credentials');

    return this.issueToken(user);
  }

  /* ---------- register ---------- */
  static async register(dto: RegisterDTO) {
    // reutiliza UserService para creación (contraseña hasheada dentro)
    const user = await svc.createUser(dto);
    return this.issueToken(user);
  }

  /* ---------- helpers ---------- */
  private static issueToken(user: RegisterDTO) {
    const token = signToken({ userId: user.id, role: user.role }); 

    // nunca exponer password
    const { password, ...safeUser } = user as any;
    return { token, user: safeUser };
  }
}
