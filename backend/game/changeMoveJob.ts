import { scheduleJob } from 'node-schedule';
import { Server } from 'socket.io';
import { io } from '../ioConnection';
import { Player } from '../models/models';
import { PlayerAttributes } from '../types/PlayerTypes';
import { socketRoomName } from '../types/RoomTypes';
import changeMove from './changeMove';
import roomController from '../controllers/roomController';

interface Payload {
  roomId: string;
  io: Server;
  socket: any;
}

export const getEndDate = () => {
  const date = new Date();
  return date.setSeconds(date.getSeconds() + 30);
};

export default function changeMoveJob(params: Payload) {
  const {
    roomId, socket,
  } = params;
  const endDate = getEndDate();
  const socketRoom = socketRoomName(roomId);
  io.of('/rooms').in(socketRoom).emit('TIME_LEFT', { date: new Date(), endDate });
  scheduleJob(roomId, endDate, async () => {
    if (!socket.adapter.rooms.get(socketRoom)) {
      return;
    }
    let timeRoom = await roomController.getRoom(roomId);
    const timePlayer = await Player.findOne({
      where: {
        roomId,
        move: true,
      },
    });
    const ids = timeRoom.roomPlayers.map((player: PlayerAttributes) => player.id);
    const userIds = timeRoom.roomPlayers.map((player: PlayerAttributes) => player.userId);
    const payload = {
      ids,
      userIds,
      currentId: timePlayer.id,
      roomName: timeRoom.name,
    };
    await changeMove(true, payload);
    timeRoom = await roomController.getRoom(roomId);
    timeRoom.move_timestamp = getEndDate();
    await timeRoom.save({ fields: ['move_timestamp'] });
    io.of('/rooms').in(socketRoom).emit('UPDATE_FIELD', { field: timeRoom });
    changeMoveJob({
      io, roomId, socket,
    });
  });
}
