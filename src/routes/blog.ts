import { Router } from 'express';
import { newBlogForm, listBlogsPage, showBlogPage } from '../controllers/blogController';

const router = Router();

router.get('/', listBlogsPage);
router.get('/new', newBlogForm);
router.get('/:id', showBlogPage);

export default router;