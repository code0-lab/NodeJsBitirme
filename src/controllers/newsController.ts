import { Request, Response } from 'express';
import News from '../models/newsModel';
import { DecodedToken } from './authController';

export async function listNewsPage(_req: Request, res: Response) {
  const items = await News.find()
    .sort({ createdAt: -1 })
    .populate('author', 'name')
    .populate('category', 'name')
    .lean();

  res.render('news/index', { title: 'Haberler', news: items });
}

export async function showNewsPage(req: Request, res: Response) {
  const item = await News.findById(req.params.id)
    .populate('author', 'name')
    .populate('category', 'name')
    .lean();

  if (!item) return res.status(404).render('errors/404', { title: '404 - Haber Bulunamadı' });
  res.render('news/show', { title: item.title, news: item });
}

export async function newNewsForm(req: Request, res: Response) {
  const user = (req as any).user as DecodedToken | undefined;
  const userRoles = Array.isArray(user?.roles) ? user!.roles : user?.roles ? [user.roles] : [];
  const allowed = userRoles.includes('admin') || userRoles.includes('author');
  if (!allowed) return res.status(403).render('errors/403', { title: '403 - Yetkisiz' });
  res.render('news/new', { title: 'Yeni Haber' });
}

// İsteğe bağlı: Web’den JSON ile haber oluşturma (form yerine AJAX kullanıyorsanız)
export async function createNews(req: Request, res: Response) {
  try {
    const user = (req as any).user as DecodedToken | undefined;
    if (!user) return res.status(401).json({ error: 'Yetkisiz: giriş yapın' });

    const { title, content, category, isActive, imageUrl } = req.body; // like/dislike kaldırıldı
    if (!title?.trim() || !content?.trim() || !category) {
      return res.status(400).json({ error: 'Başlık, içerik ve kategori zorunlu' });
    }

    const doc = await News.create({
      title: title.trim(),
      content,
      category,
      author: user.sub,
      isActive: !!isActive,
      imageUrl: imageUrl?.trim() || undefined
    });
    return res.status(201).json({ ok: true, item: doc });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}