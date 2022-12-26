import * as express from 'express';
import { User } from '../models/models';

export default async function mailDuplicate(
  req: express.Request, res: express.Response, next: express.NextFunction,
) {
  const { email } = req.body;
  const checkUser = await User.findOne({ where: { email } });
  if (checkUser) {
    return res.status(401).json({ message: 'User already exists' });
  }
  return next();
}
