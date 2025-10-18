// api.ts: News arama route’u ekleniyor ve import güncelleniyor
import { Router } from 'express';
import { authenticateJWT, authorizeRoles } from '../controllers/authController';
import { listBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../controllers/restControllers/apiBlogController';
import { register, login, profile, refresh, logout } from '../controllers/restControllers/apiAuthController';
import { searchBlogs, searchNews } from '../controllers/restControllers/apiSearchController';
import { listNews, getNews, createNews, updateNews, deleteNews, likeNews, dislikeNews } from '../controllers/restControllers/apiNewsController';
import { listCategories, getCategory, createCategory } from '../controllers/restControllers/apiCategoryController';

const router = Router();

// v1 Blogs
router.get('/v1/blogs', listBlogs);
router.get('/v1/blogs/search', searchBlogs);
router.get('/v1/search/blogs', searchBlogs);
// Yeni: v1 News arama
router.get('/v1/search/news', searchNews);

router.get('/v1/blogs/:id', getBlog);
router.post('/v1/blogs', authenticateJWT, createBlog);
router.put('/v1/blogs/:id', authenticateJWT, updateBlog);
router.delete('/v1/blogs/:id', authenticateJWT, deleteBlog);

// v1 News
router.get('/v1/news', listNews);
router.get('/v1/news/:id', getNews);
router.post('/v1/news', authenticateJWT, authorizeRoles('admin', 'author'), createNews);
router.put('/v1/news/:id', authenticateJWT, authorizeRoles('admin', 'author'), updateNews);
router.delete('/v1/news/:id', authenticateJWT, authorizeRoles('admin', 'author'), deleteNews);
router.post('/v1/news/:id/like', authenticateJWT, likeNews);
router.post('/v1/news/:id/dislike', authenticateJWT, dislikeNews);

// v1 Categories
router.get('/v1/categories', listCategories);
router.get('/v1/categories/:id', getCategory);
router.post('/v1/categories', authenticateJWT, authorizeRoles('admin'), createCategory);

// v1 Auth
router.post('/v1/auth/register', register);
router.post('/v1/auth/login', login);
router.get('/v1/auth/profile', authenticateJWT, profile);
router.post('/v1/auth/refresh', authenticateJWT, refresh);
router.post('/v1/auth/logout', authenticateJWT, logout);

export default router;