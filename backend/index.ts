import express, { NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { scheduledJobs, scheduleJob } from 'node-schedule';
import { QueryTypes } from 'sequelize';
import userRouter from './routers/userRouter';
import roomRouter from './routers/roomRouter';
import { Room, Player } from './models/models';
import { RoomStatus, socketRoomName } from './types/RoomTypes';
import checkHoriz from './game/checkHoriz';
import checkVert from './game/checkVert';
import changeMove from './game/changeMove';
import solveScore from './game/solveScore';
import roomAccess from './game/roomAccess';
import { PlayerAttributes, PlayerInstance } from './types/PlayerTypes';
import changeMoveJob, { getEndDate } from './game/changeMoveJob';
import db from './db';
import config from './config/config';
import roomController from './controllers/roomController';
import ioConnection, { io } from './ioConnection';
import {
  broadcastAvailableRooms, sendActiveRooms, sendAvailableRooms, sendMoveInfo,
} from './notifications';

const app = express();
const server = ioConnection(app);
const PORT = config.port || 7000;

app.use(cors());
app.use(express.json());
app.use(express.static('files'));

app.use('/api/user', userRouter);
app.use('/api/room', roomRouter);
app.use((err: Error, req: express.Request, res: express.Response, next: NextFunction) => {
  res.status(500).json({ message: 'Something went wrong' });
  next();
});

io.on('connection', (socket: Socket) => {
  jwt.verify(
    socket.handshake.auth.token,
    config.secret,
    (err: any, decode: any) => {
      if (err) {
        return socket.disconnect();
      }
      const userId = decode.data;
      const socketRoom = socketRoomName(userId);
      socket.join(socketRoom);
      sendAvailableRooms(userId);
      sendActiveRooms(userId);
      return null;
    },
  );
});

io.of('/rooms').on('connection', async (socket: Socket) => {
  let userId: string;
  let playername: string;
  jwt.verify(
    socket.handshake.auth.token,
    config.secret,
    (err: any, decode: any) => {
      if (err) {
        socket.disconnect();
      } else {
        userId = decode.data;
        playername = decode.name;
      }
    },
  );

  const roomId: string = socket.handshake.auth.room;
  const socketRoom: string = socketRoomName(roomId);

  const payloadAccess = {
    userId,
    playername,
    roomId,
    socket,
    socketRoom,
    io,
  };

  const currentRoom = await roomAccess(payloadAccess);

  const score = await solveScore(currentRoom);
  io.of('/rooms').in(socketRoom).emit('UPDATE_FIELD', { field: currentRoom, points: score });
  if (currentRoom.status === RoomStatus.ACTIVE) {
    const exitDate = currentRoom.move_timestamp;
    io.of('/rooms').to(socket.id).emit('TIME_LEFT', { date: new Date(), exitDate });
  }

  socket.on('START', async () => {
    const startRoom = await roomController.getRoom(roomId);
    const { roomPlayers } = startRoom;
    if (roomPlayers.length > 1) {
      startRoom.status = RoomStatus.ACTIVE;
      await startRoom.save({ fields: ['status'] });
      io.of('/rooms').in(socketRoom).emit('UPDATE_FIELD', { field: startRoom });
      io.of('/rooms').in(socketRoom).emit('TIME_LEFT', { date: new Date(), endDate: getEndDate() });
      changeMoveJob({
        io, roomId, socket,
      });
      await broadcastAvailableRooms();
      roomPlayers.map(async (player: PlayerInstance) => {
        await sendActiveRooms(player.userId);
      });
      const userIds = roomPlayers.map((player: PlayerInstance) => player.userId);
      sendMoveInfo({
        userIds,
        roomName: startRoom.name,
        roomId: startRoom.id,
        currentMoveId: socket.data.username,
      });
    }
  });

  socket.on('MOVE', async (move) => {
    let moveRoom = await roomController.getRoom(roomId);
    const movePlayer = await Player.findOne({
      where: {
        roomId,
        userId,
      },
    });
    const { x, y } = move;
    if (moveRoom.status === RoomStatus.ACTIVE
      && movePlayer.move === true
      && !moveRoom.sticks[x][y].byPlayer) {
      if (scheduledJobs[roomId]) scheduledJobs[roomId].cancel();
      moveRoom.sticks[x][y].byPlayer = socket.data.username;
      moveRoom.changed('sticks', true);
      await moveRoom.save();

      let shouldMoveChange: boolean;
      if (x % 2) shouldMoveChange = await checkVert(moveRoom, x, y, socket.data.username);
      else shouldMoveChange = await checkHoriz(moveRoom, x, y, socket.data.username);
      const newScore = await solveScore(moveRoom);
      const ids = moveRoom.roomPlayers.map((player: PlayerAttributes) => player.id);
      const userIds = moveRoom.roomPlayers.map((player: PlayerAttributes) => player.userId);
      const payload = {
        ids,
        userIds,
        currentId: movePlayer.id,
        roomName: moveRoom.name,
      };
      await changeMove(shouldMoveChange, payload);
      moveRoom = await roomController.getRoom(roomId);

      moveRoom.move_timestamp = getEndDate();
      await moveRoom.save({ fields: ['move_timestamp'] });
      io.of('/rooms').in(socketRoom).emit('UPDATE_FIELD', { field: moveRoom, points: newScore });
      io.of('/rooms').in(socketRoom).emit('TIME_LEFT', { date: new Date(), endDate: getEndDate() });
      if (moveRoom.status === RoomStatus.FINISHED) return;
      changeMoveJob({
        io, roomId, socket,
      });
    }
  });
});

scheduleJob('Delete games', '* * * * *', async () => {
  const rooms = await db.query('select * from public."rooms" a '
  + 'where not exists (select 1 from public."players" b where a.id=b."room_id" having count(*)>1)'
  + 'and a."status"=\'New Room\''
  + 'and (extract(minute from now()-a."created_at"))>2', {
    model: Room,
    type: QueryTypes.SELECT,
  });
  rooms.forEach(async (room) => {
    const deletedRoom = room;
    deletedRoom.status = RoomStatus.DELETED;
    await deletedRoom.save();
    io.of('/rooms').in(socketRoomName(deletedRoom.id)).disconnectSockets();
    broadcastAvailableRooms();
  });
});

scheduleJob('Start games', '* * * * *', async () => {
  const rooms = await db.query('select * from public."rooms" a '
  + 'where exists (select 1 from public."players" b where a.id=b."room_id" having count(*)>1)'
  + 'and a."status"=\'New Room\''
  + 'and (extract(minute from now()-a."created_at"))>2', {
    model: Room,
    type: QueryTypes.SELECT,
  });
  rooms.forEach(async (room) => {
    const activeRoom = room;
    activeRoom.status = RoomStatus.ACTIVE;
    await activeRoom.save();
    broadcastAvailableRooms();
    io.of('/rooms').in(socketRoomName(activeRoom.id)).emit('UPDATE_FIELD', { field: activeRoom });
    io.of('/rooms').in(socketRoomName(activeRoom.id)).emit('TIME_LEFT', { date: new Date(), endDate: getEndDate() });
  });
});

server.listen(PORT);
