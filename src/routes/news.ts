import { Router } from 'express';
import { authenticateWeb } from '../controllers/authController';
import { listNewsPage, newNewsForm, showNewsPage } from '../controllers/newsController';

const router = Router();

router.get('/', authenticateWeb, listNewsPage);
router.get('/new', authenticateWeb, newNewsForm);
router.get('/:id', authenticateWeb, showNewsPage);

export default router;