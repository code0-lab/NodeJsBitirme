import { Request, Response, NextFunction } from 'express';

function toHttpStatus(err: any): number {
  if (typeof err?.status === 'number') return err.status;
  if (err?.name === 'ValidationError') return 400;
  if (err?.name === 'CastError') return 400;
  return 500;
}

function toApiPayload(err: any) {
  if (err?.name === 'ValidationError' && err?.errors) {
    return {
      error: 'Validasyon hatası',
      code: 'VALIDATION_ERROR',
      details: Object.values(err.errors).map((e: any) => e.message)
    };
  }
  if (err?.name === 'CastError') {
    return { error: 'Geçersiz ID parametresi', code: 'CAST_ERROR' };
  }
  return { error: err?.message || 'Beklenmeyen hata' };
}

export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  if (req.path.startsWith('/api')) {
    return next(Object.assign(new Error('Endpoint bulunamadı'), { status: 404 }));
  }
  return res.status(404).render('errors/404', { title: '404 - Sayfa Bulunamadı' });
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const isApi = req.path.startsWith('/api');
  const status = toHttpStatus(err);

  // Minimally log; ileri seviye için logger entegrasyonu (winston/pino) eklenebilir
  if (process.env.NODE_ENV !== 'test') {
    console.error(`[Error] ${req.method} ${req.originalUrl} -> ${status}:`, err);
  }

  if (isApi) {
    return res.status(status).json(toApiPayload(err));
  }

  const message = err?.message || 'Beklenmeyen hata';
  return res
    .status(status >= 400 ? status : 500)
    .render('errors/500', {
      title: 'Sunucu Hatası',
      message,
      stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined
    });
}