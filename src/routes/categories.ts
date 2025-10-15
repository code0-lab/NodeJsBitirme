import { Router } from 'express';
import { authenticateWeb } from '../controllers/authController';
import { listCategoriesPage, newCategoryForm, createCategoryWeb } from '../controllers/categoryController';

const router = Router();

router.get('/', authenticateWeb, listCategoriesPage);
router.get('/new', authenticateWeb, newCategoryForm);
router.post('/', authenticateWeb, createCategoryWeb);

export default router;