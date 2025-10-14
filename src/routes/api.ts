import { Router } from 'express';
import { authenticateJWT } from '../controllers/authController';
import { listBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../controllers/restControllers/apiBlogController';
import { register, login } from '../controllers/restControllers/apiAuthController';
import { searchBlogs } from '../controllers/restControllers/apiSearchController';

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

export default router;