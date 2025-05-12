import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

/* ---------- Config ---------- */
const SALT_ROUNDS = 10;
const JWT_SECRET  = process.env.JWT_SECRET || 'my_jwt_secreto';

/* Lanzar error temprano si la variable no existe */
if (!JWT_SECRET) {
  throw new Error('Falta la variable de entorno JWT_SECRET');
}

/* ---------- Password helpers ---------- */
export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

export async function comparePassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

/* ---------- Token helpers ---------- */
export function signToken(payload: object, expiresIn: string | number = '2h') {
  return jwt.sign(payload, JWT_SECRET as string, { expiresIn } as jwt.SignOptions);
}

export function verifyToken<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET as string) as T;
}
