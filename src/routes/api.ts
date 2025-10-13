import { Router } from 'express';
import { register } from '../controllers/apiAuthController';

const router = Router();

router.post('/auth/register', register);

export default router;