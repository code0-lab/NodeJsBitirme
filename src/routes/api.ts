import { Router } from 'express';
import { register } from '../controllers/restControllers/apiAuthController';

const router = Router();

router.post('/auth/register', register);

export default router;