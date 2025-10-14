import { Request, Response } from 'express';
import Blog from '../../models/blogModel';
import { getQueryFromReq, makeBlogSearchFilter, normalizeLimit } from '../searchController';

export async function searchBlogs(req: Request, res: Response) {
  try {
    const q = getQueryFromReq(req);
    console.log('[searchBlogs] q=', q); // geçici log: veri akışını doğrulama
    if (!q) return res.json({ items: [] });

    const limit = normalizeLimit(req.query.limit);
    const items = await Blog.find(makeBlogSearchFilter(q))
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('title coverImageUrl createdAt author')
      .populate('author', 'name')
      .lean();

    return res.json({ items });
  } catch {
    return res.status(500).json({ error: 'Arama sırasında hata oluştu' });
  }
}