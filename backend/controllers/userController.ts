import * as express from 'express';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import { Player, Room, User } from '../models/models';
import { RoomStatus } from '../types/RoomTypes';
import config from '../config/config';

const registration = async (req: express.Request, res: express.Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: 'Invalid data' });
  }
  const { password } = req.body;
  let { username, email } = req.body;
  username = username.trim();
  email = email.trim();
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const image = 'image';
  const reqImage = req.files?.[image]?.[0];
  if (reqImage) {
    const avatar = reqImage.filename;
    await User.create({
      username,
      avatar,
      email,
      password: hashPassword,
    });
    return res.status(201).json({ message: 'Successfully' });
  }
  await User.create({
    username,
    email,
    password: hashPassword,
  });
  return res.status(201).json({ message: 'Successfully' });
};

const authorization = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ message: 'Wrong email' });
  }
  const checkPassword = bcrypt.compareSync(password, user.password);
  if (!checkPassword) {
    return res.status(401).json({ message: 'Wrong password' });
  }
  const token = jwt.sign(
    { data: user.id, name: user.username },
    config.secret, { expiresIn: '12h' },
  );
  return res.status(200).json({ token });
};

const verify = async (req: express.Request, res: express.Response) => {
  const { id } = req.body;
  const user = await User.findOne({
    where: {
      id,
    },
  });
  return res.status(200)
    .json({
      auth: true, username: user.username, id: user.id, avatar: user.avatar,
    });
};

const stats = async (req: express.Request, res: express.Response) => {
  const UserId = req.body.id;
  const wins = await Room.count({
    where: {
      status: RoomStatus.FINISHED,
    },
    include: [{
      model: Player,
      as: 'roomPlayers',
      where: {
        user_id: UserId,
        winner: true,
      },
    }],
  });
  const defeats = await Room.count({
    where: {
      status: RoomStatus.FINISHED,
    },
    include: [{
      model: Player,
      as: 'roomPlayers',
      where: {
        user_id: UserId,
        winner: false,
      },
    }],
  });
  const draws = await Room.count({
    where: {
      status: RoomStatus.DRAW,
    },
    include: [{
      model: Player,
      as: 'roomPlayers',
      where: {
        user_id: UserId,
      },
    }],
  });
  return res.status(200).json({ wins, defeats, draws });
};

const changePassword = async (req: express.Request, res: express.Response) => {
  const { oldPassword, newPassword, id } = req.body;
  const user = await User.findOne({
    where: {
      id,
    },
  });
  const checkPassword = bcrypt.compareSync(oldPassword, user.password);
  if (checkPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashPassword;
    await user.save();
    return res.status(200).json({ message: 'Successfully' });
  }
  return res.status(400).json({ message: 'Wrong old password' });
};

const changeAvatar = async (req: express.Request, res: express.Response) => {
  const { id } = req.body;
  const image = 'image';
  const reqImage = req.files?.[image]?.[0];
  const avatar = reqImage.filename;
  await User.update({
    avatar,
  }, {
    where: {
      id,
    },
  });
  await Player.update({
    avatar,
  }, {
    where: {
      userId: id,
    },
  });
  return res.status(200).json({ message: 'Successfully', avatar });
};

export default {
  registration, authorization, verify, stats, changePassword, changeAvatar,
};
