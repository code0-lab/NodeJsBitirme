import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Yggdrasil', message: 'Yggdrasil API!' });
});

export default router;