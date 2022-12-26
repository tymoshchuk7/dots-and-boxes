import { io } from './ioConnection';
import { Player, Room } from './models/models';
import { RoomStatus, socketRoomName } from './types/RoomTypes';

interface IPayload {
  type: string;
  body: any;
}

export const sendUserNotification = (userId: string, payload: IPayload) => {
  const roomName = socketRoomName(userId);
  io.in(roomName).emit('MESSAGE', payload);
};

export const broadcastNotification = (payload: IPayload) => {
  io.emit('MESSAGE', payload);
};

const getAvailableRooms = () => Room.findAll({
  where: {
    status: [RoomStatus.NEW_ROOM],
  },
});

export const broadcastAvailableRooms = async () => {
  const availableRooms = await getAvailableRooms();
  broadcastNotification({ type: 'availableRooms', body: availableRooms });
};

export const sendAvailableRooms = async (userId: string) => {
  const availableRooms = await getAvailableRooms();
  sendUserNotification(userId, { type: 'availableRooms', body: availableRooms });
};

export const sendActiveRooms = async (userId: string) => {
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
  sendUserNotification(userId, { type: 'activeRooms', body: activeRooms });
};

interface SendMoveInfoInterface {
  userIds: string[],
  roomName: string,
  roomId: string,
  currentMoveId: string
}

export const sendMoveInfo = (payload: SendMoveInfoInterface) => {
  const {
    userIds, roomName, roomId, currentMoveId,
  } = payload;
  userIds.forEach((id) => {
    sendUserNotification(id,
      {
        type: 'moveNotification',
        body: {
          roomName,
          currentMoveId,
          roomId,
          timestamp: Date.now(),
        },
      });
  });
};
