import { Optional, Model } from 'sequelize';

export const RoomStatus = {
  NEW_ROOM: 'New Room',
  ACTIVE: 'Active',
  DRAW: 'Draw',
  FINISHED: 'Finished',
  DELETED: 'Deleted',
};

export interface RoomAttributes {
  id: string;
  name: string;
  status?: string;
  width: number;
  height: number;
  sticks: any;
  boxes: any;
  move_timestamp?: number;
  roomPlayers?: Array<object>;
  createdAt?: Date;
  updatedAt?: Date;
}

interface RoomTest {
  sticks: any;
  boxes: any;
  save: () => any;
  changed?: (arg1: string, arg2: boolean) => any;
}

export const socketRoomName = (roomId: string) => `room ${roomId}`;

export interface RoomCreationAttributes extends Optional<RoomAttributes, 'id'> {}

export interface RoomInstance
  extends Model<RoomAttributes, RoomCreationAttributes>,
  RoomAttributes {}

export type RoomTypes = RoomInstance | RoomTest;
