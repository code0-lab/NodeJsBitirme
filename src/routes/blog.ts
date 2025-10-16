import { Router } from 'express';
import { newBlogForm, listBlogsPage, showBlogPage, createBlog } from '../controllers/blogController';
import { authenticateWeb } from '../controllers/authController';

const router = Router();

router.get('/', authenticateWeb, listBlogsPage);
router.get('/new', authenticateWeb, newBlogForm);
router.get('/:id', authenticateWeb, showBlogPage);
router.post('/', authenticateWeb, createBlog);

export default router;