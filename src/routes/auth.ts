import { Router } from 'express';
import { registerForm, register } from '../controllers/authController';

const router = Router();

router.get('/register', registerForm);
router.post('/register', register);

export default router;