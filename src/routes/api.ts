import { Router } from 'express';
import { authenticateJWT } from '../controllers/authController';
import { listBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../controllers/restControllers/apiBlogController';
import { register, login } from '../controllers/restControllers/apiAuthController';
import { searchBlogs } from '../controllers/restControllers/apiSearchController';
import { listNews, getNews, createNews, updateNews, deleteNews, likeNews, dislikeNews } from '../controllers/restControllers/apiNewsController';

const router = Router();

router.get('/blogs', listBlogs);
router.get('/blogs/search', searchBlogs); // mevcut çağrıları kırmadan
router.get('/search/blogs', searchBlogs); // yeni, daha anlamlı yol
router.get('/blogs/:id', getBlog);
router.post('/blogs', authenticateJWT, createBlog);
router.put('/blogs/:id', authenticateJWT, updateBlog);
router.delete('/blogs/:id', authenticateJWT, deleteBlog);
router.post('/auth/register', register);
router.post('/auth/login', login);
router.get('/news', listNews);
router.get('/news/:id', getNews);
router.post('/news', authenticateJWT, createNews);
router.put('/news/:id', authenticateJWT, updateNews);
router.delete('/news/:id', authenticateJWT, deleteNews);

// Beğeni/beğenmeme aksiyonları
router.post('/news/:id/like', authenticateJWT, likeNews);
router.post('/news/:id/dislike', authenticateJWT, dislikeNews);

export default router;