import { Router } from 'express';
import { authenticateJWT } from '../controllers/authController';
import { listBlogs, getBlog, createBlog, updateBlog, deleteBlog } from '../controllers/restControllers/apiBlogController';

const router = Router();

router.get('/blogs', listBlogs);
router.get('/blogs/:id', getBlog);
router.post('/blogs', authenticateJWT, createBlog);
router.put('/blogs/:id', authenticateJWT, updateBlog);
router.delete('/blogs/:id', authenticateJWT, deleteBlog);

export default router;