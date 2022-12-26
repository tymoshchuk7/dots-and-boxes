import { Player, User } from '../models/models';
import { PlayerAttributes } from '../types/PlayerTypes';
import roomController from '../controllers/roomController';
import { RoomStatus } from '../types/RoomTypes';
import changeMoveJob, { getEndDate } from './changeMoveJob';

function searchPlayer(players: Array<PlayerAttributes>, id: string) {
  const currentPlayer = players.find((player) => player.userId === id);
  const index = players.indexOf(currentPlayer);
  return index >= 0;
}

interface Payload {
  userId: string;
  playername: string;
  roomId: string;
  socket: any;
  socketRoom: string;
  io: any;
}

export default async function roomAccess(payload: Payload) {
  const {
    userId, playername, roomId, socket, socketRoom, io,
  } = payload;
  let currentRoom;
  let checkPlayer;
  currentRoom = await roomController.getRoom(roomId);
  const currentUser = await User.findOne({
    where: {
      id: userId,
    },
  });
  checkPlayer = await Player.findOne({
    where: {
      roomId,
      userId,
    },
  });
  const { roomPlayers } = currentRoom;

  if (roomPlayers.length <= 4 && currentRoom.status === RoomStatus.NEW_ROOM) {
    socket.join(socketRoom);
    socket.data.username = userId;
    if (!checkPlayer) {
      checkPlayer = await Player.create({
        avatar: currentUser.avatar,
        playername,
        userId,
        roomId,
      });
      currentRoom = await roomController.getRoom(roomId);
    }
  } else if (searchPlayer(roomPlayers, checkPlayer.userId)) {
    socket.join(socketRoom);
    socket.data.username = userId;
    const timeDif = currentRoom.move_timestamp - Date.now();
    if (timeDif < 0) {
      changeMoveJob({ socket, io, roomId: currentRoom.id });
      currentRoom.move_timestamp = getEndDate();
      await currentRoom.save({ fields: ['move_timestamp'] });
    }
  } else {
    socket.disconnect();
  }

  return currentRoom;
}
