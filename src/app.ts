import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

import indexRouter from './routes/index';
import authRouter from './routes/auth';
import categoriesRouter from './routes/categories';
// @ts-ignore
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';
import apiRouter from './routes/api';
import blogRouter from './routes/blog';
import { attachUserToLocals } from './controllers/authController';
import newsRouter from './routes/news';
import './models/categoriesModel'; // Category modelini kaydet (populate için gerekli)
import session from 'express-session';

const app = express();

// View engine: EJS (ortama göre doğru klasörü bul)
const candidateViewPaths = [
  path.join(__dirname, 'views'),                // ts-node-dev (src/views)
  path.join(process.cwd(), 'src', 'views'),     // prod: dist -> src/views
  path.join(process.cwd(), 'views')             // kök: views/
];
const viewsDir = candidateViewPaths.find((p) => fs.existsSync(p)) || candidateViewPaths[1];
app.set('views', viewsDir);
app.set('view engine', 'ejs');

// Statik dosyalar
app.use(express.static(path.join(__dirname, '../public')));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Yeni: session middleware (EJS/web için)
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret_change_me',
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 1000 }
}));

// Kullanıcı bilgisini EJS'e geçir (session’dan veya JWT fallback)
app.use(attachUserToLocals);

app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/categories', categoriesRouter);
app.use('/blogs', blogRouter);
app.use('/news', newsRouter);
app.use('/api', apiRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 404 handler: API için JSON, web için EJS
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'Endpoint bulunamadı' });
  }
  res.status(404).render('errors/404', { title: '404 - Kayıp Haber' });
});

export default app;