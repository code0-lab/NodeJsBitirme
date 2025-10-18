import { Router, Request } from 'express';
import { authenticateJWT, authorizeRoles } from '../controllers/authController';
import { listBlogs, getBlog, createBlog, updateBlog, deleteBlog, likeBlog, dislikeBlog } from '../controllers/restControllers/apiBlogController';
import { register, login, profile, refresh, logout } from '../controllers/restControllers/apiAuthController';
import { searchBlogs, searchNews } from '../controllers/restControllers/apiSearchController';
import { listNews, getNews, createNews, updateNews, deleteNews, likeNews, dislikeNews } from '../controllers/restControllers/apiNewsController';
import { listCategories, getCategory, createCategory } from '../controllers/restControllers/apiCategoryController';
import multer from 'multer';
import path from 'path';
import {
  getMyProfile,
  updateMyInfo,
  changeMyPassword,
  uploadMyAvatar,
  deleteMe,
  adminDeleteUser,
  adminUpdateRoles
} from '../controllers/restControllers/apiProfileController';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (
    _req: Request,
    file: { originalname: string; mimetype: string },
    cb: (error: Error | null, acceptFile?: boolean) => void
  ) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    const allowedExts = ['.png', '.jpg', '.jpeg', '.webp'];
    const ext = path.extname(file.originalname || '').toLowerCase();

    if (!allowedTypes.includes(file.mimetype) || !allowedExts.includes(ext)) {
      return cb(Object.assign(new Error('Desteklenmeyen dosya tipi veya uzantı'), { status: 400 }));
    }
    cb(null, true);
  }
});

// v1 Blogs
router.get('/v1/blogs', listBlogs);
router.get('/v1/blogs/search', searchBlogs);
router.get('/v1/search/blogs', searchBlogs);
// Yeni: v1 News arama
router.get('/v1/search/news', searchNews);

router.get('/v1/blogs/:id', getBlog);
router.post('/v1/blogs', authenticateJWT, createBlog);
router.put('/v1/blogs/:id', authenticateJWT, updateBlog);
router.delete('/v1/blogs/:id', authenticateJWT, deleteBlog);
router.post('/v1/blogs/:id/like', authenticateJWT, likeBlog);
router.post('/v1/blogs/:id/dislike', authenticateJWT, dislikeBlog);

// v1 News
router.get('/v1/news', listNews);
router.get('/v1/news/:id', getNews);
router.post('/v1/news', authenticateJWT, authorizeRoles('admin', 'author'), createNews);
router.put('/v1/news/:id', authenticateJWT, authorizeRoles('admin', 'author'), updateNews);
router.delete('/v1/news/:id', authenticateJWT, authorizeRoles('admin', 'author'), deleteNews);
router.post('/v1/news/:id/like', authenticateJWT, likeNews);
router.post('/v1/news/:id/dislike', authenticateJWT, dislikeNews);

// v1 Categories
router.get('/v1/categories', listCategories);
router.get('/v1/categories/:id', getCategory);
router.post('/v1/categories', authenticateJWT, authorizeRoles('admin'), createCategory);

// v1 Auth
router.post('/v1/auth/register', register);
router.post('/v1/auth/login', login);
router.get('/v1/auth/profile', authenticateJWT, profile);
router.post('/v1/auth/refresh', authenticateJWT, refresh);
router.post('/v1/auth/logout', authenticateJWT, logout);

// v1 Profile (JWT)
router.get('/v1/profile', authenticateJWT, getMyProfile);
router.put('/v1/profile', authenticateJWT, updateMyInfo);
router.post('/v1/profile/password', authenticateJWT, changeMyPassword);
router.post('/v1/profile/picture', authenticateJWT, upload.single('avatar'), uploadMyAvatar);
router.delete('/v1/profile', authenticateJWT, deleteMe);

// v1 Admin (JWT + admin)
router.delete('/v1/admin/users/:id', authenticateJWT, authorizeRoles('admin'), adminDeleteUser);
router.put('/v1/admin/users/:id/roles', authenticateJWT, authorizeRoles('admin'), adminUpdateRoles);

export default router;