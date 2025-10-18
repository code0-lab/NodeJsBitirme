import { Router } from 'express';
import { newBlogForm, listBlogsPage, showBlogPage, createBlog, editBlogForm, updateBlog, deleteBlog, togglePublish } from '../controllers/blogController';
import { authenticateWeb } from '../controllers/authController';
import { likeBlog, dislikeBlog } from '../controllers/restControllers/apiBlogController';

const router = Router();

router.get('/', authenticateWeb, listBlogsPage);
router.get('/new', authenticateWeb, newBlogForm);
router.get('/:id/edit', authenticateWeb, editBlogForm);
router.get('/:id', authenticateWeb, showBlogPage);

router.post('/', authenticateWeb, createBlog);
router.patch('/:id', authenticateWeb, updateBlog);
router.delete('/:id', authenticateWeb, deleteBlog);
// Yeni: yayın durumu ucu
router.patch('/:id/publish', authenticateWeb, togglePublish);

// Blog reactions (web)
router.post('/:id/like', authenticateWeb, likeBlog);
router.post('/:id/dislike', authenticateWeb, dislikeBlog);

// Form fallback’ları (PATCH/DELETE desteklemeyen durumlar için)
router.post('/:id', authenticateWeb, updateBlog);
router.post('/:id/delete', authenticateWeb, deleteBlog);

export default router;