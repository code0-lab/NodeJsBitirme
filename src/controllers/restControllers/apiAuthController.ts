import { Request, Response } from 'express';
import { registerUser, loginUser, AppError } from '../../services/authService';

export async function register(req: Request, res: Response) {
  try {
    const created = await registerUser(req.body as { email?: string; password?: string; name?: string });
    return res.status(201).json({
      id: created._id,
      email: created.email,
      name: created.name,
      roles: created.roles
    });
  } catch (err) {
    const status = err instanceof AppError ? err.status : 500;
    const msg = err instanceof AppError ? err.message : 'Beklenmeyen bir hata oluştu.';
    return res.status(status).json({ error: msg });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { user, token } = await loginUser(req.body as { email?: string; password?: string });
    return res.status(200).json({
      token,
      user: { id: user._id, email: user.email, name: user.name, roles: user.roles }
    });
  } catch (err) {
    const status = err instanceof AppError ? err.status : 500;
    const msg = err instanceof AppError ? err.message : 'Beklenmeyen bir hata oluştu.';
    return res.status(status).json({ error: msg });
  }
}