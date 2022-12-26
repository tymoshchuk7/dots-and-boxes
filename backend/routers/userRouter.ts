import * as express from 'express';
import path from 'path';
import { check } from 'express-validator';
import * as dotenv from 'dotenv';
import multer from 'multer';
import mailCheck from '../middlewares/mailDuplicate';
import isAuth from '../middlewares/isAuth';
import userController from '../controllers/userController';

dotenv.config();
const router = express.Router();
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './files');
  },
  filename(req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}.jpg`);
  },
});
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  }
  return cb('Images only!');
}
const upload = multer({
  storage,
  fileFilter(req, file, cb) {
    checkFileType(file, cb);
  },
});
const registrationMiddlewares = [
  upload.fields([{ name: 'image', maxCount: 1 }]),
  mailCheck,
  check('username').notEmpty().isLength({ min: 3, max: 20 }),
  check('email').isEmail().isLength({ min: 4, max: 20 }),
  check('password').isLength({ min: 4, max: 20 }),
];
const changePasswordMiddlewares = [
  isAuth,
  check('newPassword').isLength({ min: 4, max: 20 }),
];
const changeAvatarMiddlewares = [
  upload.fields([{ name: 'image', maxCount: 1 }]),
  isAuth,
];

router.post('/registration', registrationMiddlewares, userController.registration);

router.post('/auth', userController.authorization);

router.post('/verify', isAuth, userController.verify);

router.post('/stats', isAuth, userController.stats);

router.post('/change_password', changePasswordMiddlewares, userController.changePassword);

router.post('/change_avatar', changeAvatarMiddlewares, userController.changeAvatar);

export default router;
