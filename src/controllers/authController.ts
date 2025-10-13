import { Request, Response } from 'express';
import User from '../models/userModel';
import { isValidEmail, isValidPassword } from '../utils/validators';

export async function registerForm(req: Request, res: Response) {
  res.render('auth/register', { title: 'Kayıt Ol', errors: [], values: {} });
}

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };
  const errors: string[] = [];
  const values = { email, name };

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