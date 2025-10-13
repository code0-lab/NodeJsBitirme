import { Request, Response } from 'express';
import User from '../../models/userModel';
import { isValidEmail, isValidPassword } from '../../utils/validators';

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body as { email?: string; password?: string; name?: string };

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Geçerli bir e-posta girin.' });
  }
  if (!password || !isValidPassword(password)) {
    return res.status(400).json({ error: 'Şifre en az 8 karakter olmalı.' });
  }

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: 'Bu e-posta zaten kayıtlı.' });
    }

    const created = await User.create({ email, password, name, role: 'user' });

    return res.status(201).json({
      id: created._id,
      email: created.email,
      name: created.name,
      role: created.role
    });
  } catch (err) {
    return res.status(500).json({ error: 'Beklenmeyen bir hata oluştu.' });
  }
}