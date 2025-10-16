import { Router } from 'express';
import { registerForm, register } from '../controllers/registerController';
import { loginForm, login } from '../controllers/loginController';
import { logout } from '../controllers/profileController';
const router = Router();

router.get('/register', registerForm);
router.post('/register', register);

router.get('/login', loginForm);
router.post('/login', login);

router.get('/logout', logout);
export default router;