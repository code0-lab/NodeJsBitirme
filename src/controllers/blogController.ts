import { Request, Response } from 'express';
import Blog from '../models/blogModel';
import { DecodedToken } from './authController';
import Category from '../models/categoriesModel';

export async function createBlog(req: Request, res: Response) {
  try {
    const user = (req as any).user as DecodedToken | undefined;
    if (!user) {
      return res.status(401).json({ error: 'Yetkisiz: giriş yapın' });
    }

    const { title, content, tags, categories, coverImageUrl, isPublished } = req.body;
    const normalizedCategories = Array.isArray(categories)
      ? categories.map((c: any) => String(c).trim()).filter(Boolean)
      : typeof categories === 'string' && categories.length
      ? categories.split(',').map((c: string) => c.trim()).filter(Boolean)
      : [];

    const doc = await Blog.create({
      title,
      content,
      tags,
      categories: normalizedCategories,
      coverImageUrl,
      isPublished: !!isPublished,
      author: user.sub
    });

    return res.status(201).json({ ok: true, blog: doc });
  } catch (err) {
    return res.status(400).json({
      error: 'Blog oluşturulamadı',
      details: (err as Error).message
    });
  }
}

export async function listBlogsPage(_req: Request, res: Response) {
  const blogs = await Blog.find().sort({ createdAt: -1 }).populate('author', 'name').lean();
  res.render('blogs/index', { title: 'Blog', blogs });
}

export async function showBlogPage(req: Request, res: Response) {
  const blog = await Blog.findById(req.params.id).populate('author', 'name').lean();
  if (!blog) return res.status(404).render('errors/404', { title: '404 - Blog Yok' });
  res.render('blogs/show', { title: blog.title, blog });
}

export async function newBlogForm(req: Request, res: Response) {
  const categories = await Category.find({ isActive: true, kind: { $in: ['blog', 'both'] } })
    .sort({ name: 1 })
    .lean();
  res.render('blogs/new', { title: 'Yeni Blog Yazısı', categories });
}