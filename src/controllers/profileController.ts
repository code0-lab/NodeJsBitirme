import { Request, Response } from 'express';

export function logout(_req: Request, res: Response) {
  // JWT cookie'yi temizle
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    // path varsayılan olarak '/', login ile aynıysa gerekir
  });

  // İsteğe bağlı: tarayıcı localStorage'da token varsa temizlemek için bir sayfaya yönlendirme yapılabilir.
  // Şimdilik ana sayfaya dönüyoruz.
  return res.redirect('/');
}