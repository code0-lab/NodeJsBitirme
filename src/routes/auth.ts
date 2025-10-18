import { Router, Request } from 'express';
import { registerForm, register } from '../controllers/registerController';
import { loginForm, login } from '../controllers/loginController';
import { logout, profilePage, updateProfileInfo, changePassword, uploadProfilePicture, myBlogs } from '../controllers/profileController';
import { authenticateWeb } from '../controllers/authController';
import multer from 'multer';
import path from 'path';
const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 }, // 2MB, tek dosya
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

router.get('/register', registerForm);
router.post('/register', register);

router.get('/login', loginForm);
router.post('/login', login);

// Profil EJS sayfası ve formları
router.get('/profile', authenticateWeb, profilePage);
router.post('/profile/info', authenticateWeb, updateProfileInfo);
router.post('/profile/password', authenticateWeb, changePassword);
router.post('/profile/picture', authenticateWeb, upload.single('avatar'), uploadProfilePicture);

// Bloglarım JSON listesi
router.get('/profile/blogs', authenticateWeb, myBlogs);

router.get('/logout', logout);
export default router;