import { Request, Response } from 'express';
import { loginUser, AppError } from '../services/authService';

export async function loginForm(req: Request, res: Response) {
  res.render('auth/login', { title: 'Giriş Yap', errors: [], values: {} });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email?: string; password?: string };
  const values = { email };

  try {
    await loginUser({ email, password });

    return res.render('auth/login', {
      title: 'Giriş Yap',
      errors: [],
      values: {},
      success: 'Giriş başarılı! Token üretildi.'
    });
  } catch (err) {
    const status = err instanceof AppError ? err.status : 500;
    const msg = err instanceof AppError ? err.message : 'Beklenmeyen bir hata oluştu.';

    return res.status(status).render('auth/login', { title: 'Giriş Yap', errors: [msg], values });
  }
}