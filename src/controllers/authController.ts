import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser, UserRole } from '../models/userModel';
import User from '../models/userModel';
import { isValidEmail, isValidPassword } from '../utils/validators';

export interface DecodedToken {
  sub: string;
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET || '';
  if (!secret) {
    throw new Error('JWT_SECRET .env içinde tanımlı olmalı');
  }
  return secret;
}

export function signToken(user: IUser): string {
  const payload: Omit<DecodedToken, 'iat' | 'exp'> = {
    sub: String(user._id),
    role: user.role,
    email: user.email
  };
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '1h' });
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Yetkisiz: Bearer token gerekli' });
  }
  const token = auth.substring('Bearer '.length);

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as DecodedToken;
    (req as any).user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token' });
  }
}

export function authorizeRoles(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as DecodedToken | undefined;
    if (!user) {
      return res.status(401).json({ error: 'Yetkisiz: Kimlik doğrulama gerekli' });
    }
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'Erişim reddedildi: rol yetkisi yok' });
    }
    next();
  };
}

export async function registerForm(req: Request, res: Response) {
  res.render('auth/register', { title: 'Kayıt Ol', errors: [], values: {} });
}

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };
  const errors: string[] = [];
  const values = { email, name };

  // Satır 68–69: validators.ts ile doğrulama
  if (!email || !isValidEmail(email)) errors.push('Geçerli bir e-posta girin.');
  if (!password || !isValidPassword(password)) errors.push('Şifre en az 8 karakter olmalı.');

  if (errors.length) {
    return res.status(400).render('auth/register', { title: 'Kayıt Ol', errors, values });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).render('auth/register', { title: 'Kayıt Ol', errors: ['Bu e-posta zaten kayıtlı.'], values });
    }

    await User.create({ email, password, name, role: 'user' });

    // İstersen burada login sayfasına yönlendirebiliriz.
    return res.status(201).render('auth/register', { title: 'Kayıt Ol', errors: [], values: {}, success: 'Kayıt başarılı! Giriş yapabilirsiniz.' });
  } catch (err) {
    return res.status(500).render('auth/register', { title: 'Kayıt Ol', errors: ['Beklenmeyen bir hata oluştu.'], values });
  }
}