// logout(): session destroy

import { Request, Response } from 'express';

export function logout(req: Request, res: Response) {
    req.session?.destroy(() => {
        // JWT cookie kullanılmıyorsa bile güvenli temizlik zarar vermez
        res.clearCookie('token', { httpOnly: true, sameSite: 'lax' });
        return res.redirect('/');
    });
}