import { Router } from 'express';
import { authenticateWeb, authorizeRoles } from '../controllers/authController';
import { listNewsPage, newNewsForm, showNewsPage, createNews } from '../controllers/newsController';
import { likeNews, dislikeNews } from '../controllers/restControllers/apiNewsController';

const router = Router();

router.get('/', authenticateWeb, listNewsPage);
router.get('/new', authenticateWeb, newNewsForm);
router.get('/:id', authenticateWeb, showNewsPage);
router.post('/', authenticateWeb, authorizeRoles('admin', 'author'), createNews);
router.post('/:id/like', authenticateWeb, likeNews);
router.post('/:id/dislike', authenticateWeb, dislikeNews);

export default router;