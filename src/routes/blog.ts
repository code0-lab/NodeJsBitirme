import { Router } from 'express';
import { newBlogForm, listBlogsPage, showBlogPage } from '../controllers/blogController';
import { authenticateWeb } from '../controllers/authController';

const router = Router();

router.get('/', authenticateWeb, listBlogsPage);
router.get('/new', authenticateWeb, newBlogForm);
router.get('/:id', authenticateWeb, showBlogPage);

export default router;