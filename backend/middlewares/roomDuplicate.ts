import * as express from 'express';
import { Room } from '../models/models';

export default async function roomDuplicate(
  req: express.Request, res: express.Response, next: express.NextFunction,
) {
  const { name } = req.body;
  const checkRoom = await Room.findOne({ where: { name } });
  if (checkRoom) {
    return res.status(400).json({ message: 'Room with that name already exists' });
  }
  return next();
}
