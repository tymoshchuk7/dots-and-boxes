import * as express from 'express';
import { validationResult } from 'express-validator';
import { Player, Room, User } from '../models/models';
import { broadcastAvailableRooms } from '../notifications';
import { RoomStatus, RoomInstance } from '../types/RoomTypes';

const create = async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid field parametres' });
  }
  const { width, height } = req.body;
  let { name } = req.body;
  name = name.trim();
  const { id, playername } = req.body;
  const sticks = [];
  const boxes = [];
  for (let i = 0; i <= height * 2; i += 1) {
    sticks.push([]);
    const countWidth = i % 2 ? Number(width) + 1 : width;
    for (let j = 0; j < countWidth; j += 1) sticks[i].push({ byPlayer: null });
  }
  for (let i = 0; i < width; i += 1) {
    boxes.push([]);
    for (let j = 0; j < height; j += 1) boxes[i].push({ byPlayer: null });
  }
  const newRoom = await Room.create({
    name,
    width,
    height,
    sticks,
    boxes,
  });
  const user = await User.findOne({
    where: {
      id,
    },
  });
  await Player.create({
    userId: id,
    roomId: newRoom.id,
    avatar: user.avatar,
    playername,
    move: true,
    creator: true,
  });
  await broadcastAvailableRooms();
  return res.status(201).json({ message: 'Successfully' });
};

const allRooms = async (req: express.Request, res: express.Response) => {
  const userId = req.body.id;
  const availableRooms = await Room.findAll({
    where: {
      status: [RoomStatus.NEW_ROOM],
    },
  });
  const activeRooms = await Room.findAll({
    where: {
      status: RoomStatus.ACTIVE,
    },
    include: {
      model: Player,
      as: 'roomPlayers',
      where: {
        userId,
      },
    },
  });
  return res.status(200).json({ availableRooms, activeRooms });
};

const getRoom = async (RoomId: string): Promise<RoomInstance> => {
  const room = await Room.findOne({
    where: {
      id: RoomId,
    },
    include: {
      as: 'roomPlayers',
      model: Player,
      separate: true,
      order: [
        ['created_at', 'ASC'],
      ],
    },
  });
  return room;
};

export default { create, allRooms, getRoom };
