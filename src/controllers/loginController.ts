// Üst importlar tekilleştirildi
import { Request, Response } from 'express';
import { loginUser, AppError } from '../services/authService';

export async function loginForm(req: Request, res: Response) {
  res.render('auth/login', { title: 'Giriş Yap', errors: [], values: {} });
}

// login(): JWT cookie yerine session’a kullanıcıyı yaz
export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  const values = { email };

  try {
    const { user } = await loginUser({ email, password });

    // Web oturumu: Kullanıcıyı session’a koy
    (req as any).session.user = {
      sub: String(user._id),
      email: user.email,
      name: user.name,
      roles: user.roles
    };

    return res.redirect('/news');
  } catch (err) {
    const status = err instanceof AppError ? err.status : 500;
    const msg = err instanceof AppError ? err.message : 'Beklenmeyen bir hata oluştu.';
    return res.status(status).render('auth/login', { title: 'Giriş Yap', errors: [msg], values });
  }
}