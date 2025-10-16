import { Request, Response } from 'express';
import Blog from '../../models/blogModel';
import { DecodedToken } from '../authController';

function isOwnerOrAdmin(user: DecodedToken | undefined, author: any) {
  if (!user) return false;
  const isOwner = String(author) === String(user.sub);
  const isAdmin = Array.isArray(user.roles) ? user.roles.includes('admin') : user.roles === 'admin';
  return isOwner || isAdmin;
}

export async function listBlogs(_req: Request, res: Response) {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate('createdAt', 'title')
      .populate('content', 'tags')
      .lean();

    return res.json({ items: blogs });
  } catch {
    return res.status(500).json({ error: 'Bloglar listelenemedi' });
  }
}

export async function getBlog(req: Request, res: Response) {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name email')
      .populate('categories', 'name')
      .lean();

    if (!blog) return res.status(404).json({ error: 'Blog bulunamadı' });
    return res.json({ item: blog });
  } catch {
    return res.status(400).json({ error: 'Geçersiz blog id' });
  }
}

// createBlog (REST)
export async function createBlog(req: Request, res: Response) {
  try {
    const user = (req as any).user as DecodedToken | undefined;
    if (!user) return res.status(401).json({ error: 'Yetkisiz: giriş yapın' });

    const { title, content, tags, categories, coverImageUrl, isPublished } = req.body;

    if (!title?.trim() || !content?.trim()) {
      return res.status(400).json({ error: 'Başlık ve içerik zorunlu' });
    }

    const normalizedTags = Array.isArray(tags)
      ? tags.map((t) => String(t).trim()).filter(Boolean)
      : typeof tags === 'string' && tags.length
      ? tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const normalizedCategories = Array.isArray(categories)
      ? categories.map((c) => String(c).trim()).filter(Boolean)
      : [];

    try {
      const doc = await Blog.create({
        title: title.trim(),
        content,
        tags: normalizedTags,
        categories: normalizedCategories,
        coverImageUrl,
        isPublished: !!isPublished,
        author: user.sub
      });
      return res.status(201).json({ ok: true, item: doc });
    } catch (err) {
      return res.status(400).json({ error: (err as Error).message });
    }
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}

export async function updateBlog(req: Request, res: Response) {
  try {
    const user = (req as any).user as DecodedToken | undefined;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog bulunamadı' });
    if (!isOwnerOrAdmin(user, blog.author)) return res.status(403).json({ error: 'Yetkisiz' });

    const { title, content, tags, categories, coverImageUrl, isPublished } = req.body;
    blog.title = title ?? blog.title;
    blog.content = content ?? blog.content;
    blog.tags = tags ?? blog.tags;
    blog.categories = categories ?? blog.categories;
    blog.coverImageUrl = coverImageUrl ?? blog.coverImageUrl;
    blog.isPublished = isPublished ?? blog.isPublished;

    await blog.save();
    return res.json({ ok: true, item: blog });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}

export async function deleteBlog(req: Request, res: Response) {
  try {
    const user = (req as any).user as DecodedToken | undefined;
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Blog bulunamadı' });
    if (!isOwnerOrAdmin(user, blog.author)) return res.status(403).json({ error: 'Yetkisiz' });

    await blog.deleteOne();
    return res.json({ ok: true });
  } catch (err) {
    return res.status(400).json({ error: (err as Error).message });
  }
}
