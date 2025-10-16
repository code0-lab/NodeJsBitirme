import { Request, Response } from 'express';
import News from '../models/newsModel';
import { DecodedToken } from './authController';
import Category from '../models/categoriesModel';

export async function listNewsPage(req: Request, res: Response) {
    const limit = 9;
    const totalCount = await News.countDocuments({});
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const currentPage = Math.min(Math.max(Number(req.query.page) || 1, 1), totalPages);
    const skip = (currentPage - 1) * limit;

    const items = await News.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('author', 'name')
      .populate('category', 'name')
      .lean();

    res.render('news/index', {
      title: 'Haberler',
      news: items,
      currentPage,
      totalPages
    });
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

  const categories = await Category.find({ isActive: true, kind: { $in: ['news', 'both'] } })
    .sort({ name: 1 })
    .lean();

  res.render('news/new', { title: 'Yeni Haber', categories });
}

// İsteğe bağlı: Web’den JSON ile haber oluşturma (form yerine AJAX kullanıyorsanız)
export async function createNews(req: Request, res: Response) {
  try {
    const user = (req as any).user as DecodedToken | undefined;
    if (!user) return res.status(401).json({ error: 'Yetkisiz: giriş yapın' });

    const { title, content, category, isActive, imageUrl } = req.body; // like/dislike kaldırıldı
    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'Başlık ve içerik zorunlu' });
    }

    const doc = await News.create({
      title: title.trim(),
      content,
      category: category || undefined, // kategori artık opsiyonel
      author: user.sub,
      isActive: !!isActive,
      imageUrl: imageUrl?.trim() || undefined
    });
    return res.status(201).json({ ok: true, item: doc });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}