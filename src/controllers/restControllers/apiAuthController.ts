import { Request, Response } from 'express';
import { registerUser, loginUser, AppError } from '../../services/authService';
import User from '../../models/userModel';
import { signToken, DecodedToken } from '../../controllers/authController';

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

export async function profile(req: Request, res: Response) {
  try {
    const decoded = (req as any).user as DecodedToken | undefined;
    if (!decoded) return res.status(401).json({ error: 'Yetkisiz: token gerekli' });

    const user = await User.findById(decoded.sub)
      .select('_id email name roles createdAt updatedAt')
      .lean();
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    return res.status(200).json({ user: { id: user._id, email: user.email, name: user.name, roles: user.roles } });
  } catch {
    return res.status(500).json({ error: 'Profil bilgileri alınamadı' });
  }
}

export async function refresh(req: Request, res: Response) {
  try {
    const decoded = (req as any).user as DecodedToken | undefined;
    if (!decoded) return res.status(401).json({ error: 'Yetkisiz: token gerekli' });

    const user = await User.findById(decoded.sub);
    if (!user) return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
    const token = signToken(user);
    return res.status(200).json({ token });
  } catch {
    return res.status(500).json({ error: 'Token yenilenemedi' });
  }
}

export async function logout(_req: Request, res: Response) {
  // JWT stateless olduğu için sunucu tarafında bloklama yapılmaz;
  // tarayıcıda cookie taşıyan akışlar için cookie temizliği yapılır.
  res.setHeader('Set-Cookie', 'token=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax');
  return res.status(200).json({ ok: true, message: 'Çıkış yapıldı' });
}