import * as express from 'express';
import { check } from 'express-validator';
import roomCheck from '../middlewares/roomDuplicate';
import isAuth from '../middlewares/isAuth';
import roomController from '../controllers/roomController';

const router = express.Router();
const middlewares = [
  isAuth,
  roomCheck,
  check('name').notEmpty().isLength({ min: 3, max: 30 }),
  check(['width', 'height']).isInt({ min: 2, max: 30 }),
];

router.post('/create', middlewares, roomController.create);

router.post('/all', isAuth, roomController.allRooms);

export default router;
