import { Request, Response } from 'express';
import News from '../../models/newsModel';
import { DecodedToken } from '../authController';

function isOwnerOrAdmin(user: DecodedToken | undefined, author: any) {
  if (!user) return false;
  const isOwner = String(author) === String(user.sub);
  const isAdmin = user.role === 'admin';
  return isOwner || isAdmin;
}

export async function listNews(_req: Request, res: Response) {
  try {
    const items = await News.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name email')
      .populate('category', 'name')
      .lean();

    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Haberler listelenemedi' });
  }
}

export async function getNews(req: Request, res: Response) {
  try {
    const item = await News.findById(req.params.id)
      .populate('author', 'name email')
      .populate('category', 'name')
      .lean();

    if (!item) return res.status(404).json({ error: 'Haber bulunamadı' });
    return res.json({ item });
  } catch {
    return res.status(400).json({ error: 'Geçersiz haber id' });
  }
}

// Dosya: apiNewsController.ts içindeki createNews
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

// Dosya: apiNewsController.ts içindeki updateNews
export async function updateNews(req: Request, res: Response) {
  try {
    const user = (req as any).user as DecodedToken | undefined;
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'Haber bulunamadı' });
    if (!isOwnerOrAdmin(user, news.author)) return res.status(403).json({ error: 'Yetkisiz' });

    const { title, content, category, isActive, imageUrl } = req.body; // like/dislike güncellenmez
    news.title = title ?? news.title;
    news.content = content ?? news.content;
    news.category = category ?? news.category;
    news.isActive = typeof isActive === 'boolean' ? isActive : news.isActive;
    if (typeof imageUrl !== 'undefined') {
      news.imageUrl = imageUrl?.trim() || undefined;
    }
    await news.save();
    return res.json({ ok: true, item: news });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}

export async function deleteNews(req: Request, res: Response) {
  try {
    const user = (req as any).user as DecodedToken | undefined;
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'Haber bulunamadı' });
    if (!isOwnerOrAdmin(user, news.author)) return res.status(403).json({ error: 'Yetkisiz' });

    await news.deleteOne();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}

// Yeni: beğeni endpoint’i
export async function likeNews(req: Request, res: Response) {
  try {
    const user = (req as any).user as DecodedToken | undefined;
    if (!user) return res.status(401).json({ error: 'Yetkisiz: giriş yapın' });

    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'Haber bulunamadı' });

    const userId = user.sub;
    const likesArray = Array.isArray((news as any).likesID) ? (news as any).likesID : [];
    const dislikesArray = Array.isArray((news as any).dislikesID) ? (news as any).dislikesID : [];

    // Dizi olmayan eski veri varsa normalize et
    if (!Array.isArray((news as any).likesID) || !Array.isArray((news as any).dislikesID)) {
      await News.updateOne({ _id: news._id }, { $set: { likesID: likesArray, dislikesID: dislikesArray } });
    }

    const likedByUser = likesArray.some((id: any) => String(id) === String(userId));
    const dislikedByUser = dislikesArray.some((id: any) => String(id) === String(userId));

    let action = 'liked';
    let updated = null;

    if (likedByUser) {
      // Aynı reaksiyona tekrar basıldı: geri al (unlike)
      updated = await News.findByIdAndUpdate(
        req.params.id,
        { $pull: { likesID: userId } },
        { new: true }
      ).lean();
      action = 'unliked';
    } else if (dislikedByUser) {
      // Karşı reaksiyona basıldı: dislike -> like olarak değiştir
      updated = await News.findByIdAndUpdate(
        req.params.id,
        { $pull: { dislikesID: userId }, $addToSet: { likesID: userId } },
        { new: true }
      ).lean();
      action = 'switched_to_like';
    } else {
      // İlk kez beğeniyor
      updated = await News.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likesID: userId } },
        { new: true }
      ).lean();
      action = 'liked';
    }

    return res.json({
      ok: true,
      action,
      likesCount: Array.isArray(updated?.likesID) ? updated!.likesID.length : 0,
      dislikesCount: Array.isArray(updated?.dislikesID) ? updated!.dislikesID.length : 0
    });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}

// Yeni: beğenmeme endpoint’i
export async function dislikeNews(req: Request, res: Response) {
  try {
    const user = (req as any).user as DecodedToken | undefined;
    if (!user) return res.status(401).json({ error: 'Yetkisiz: giriş yapın' });

    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ error: 'Haber bulunamadı' });

    const userId = user.sub;
    const likesArray = Array.isArray((news as any).likesID) ? (news as any).likesID : [];
    const dislikesArray = Array.isArray((news as any).dislikesID) ? (news as any).dislikesID : [];

    // Dizi olmayan eski veri varsa normalize et
    if (!Array.isArray((news as any).likesID) || !Array.isArray((news as any).dislikesID)) {
      await News.updateOne({ _id: news._id }, { $set: { likesID: likesArray, dislikesID: dislikesArray } });
    }

    const likedByUser = likesArray.some((id: any) => String(id) === String(userId));
    const dislikedByUser = dislikesArray.some((id: any) => String(id) === String(userId));

    let action = 'disliked';
    let updated = null;

    if (dislikedByUser) {
      // Aynı reaksiyona tekrar basıldı: geri al (undislike)
      updated = await News.findByIdAndUpdate(
        req.params.id,
        { $pull: { dislikesID: userId } },
        { new: true }
      ).lean();
      action = 'undisliked';
    } else if (likedByUser) {
      // Karşı reaksiyon: like -> dislike olarak değiştir
      updated = await News.findByIdAndUpdate(
        req.params.id,
        { $pull: { likesID: userId }, $addToSet: { dislikesID: userId } },
        { new: true }
      ).lean();
      action = 'switched_to_dislike';
    } else {
      // İlk kez beğenmiyor
      updated = await News.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { dislikesID: userId } },
        { new: true }
      ).lean();
      action = 'disliked';
    }

    return res.json({
      ok: true,
      action,
      likesCount: Array.isArray(updated?.likesID) ? updated!.likesID.length : 0,
      dislikesCount: Array.isArray(updated?.dislikesID) ? updated!.dislikesID.length : 0
    });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}