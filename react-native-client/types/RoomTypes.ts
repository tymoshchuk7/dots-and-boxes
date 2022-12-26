export interface AllRooms {
  available: any[];
  active: any[];
  error: null | string;
}

export interface CreateRoom {
  message: string;
  error: null | string;
}

export interface RoomPlayer {
  id: string;
  userId: string;
  roomId: string;
  avatar: string;
  playername: string;
  creator: boolean;
  winner: boolean;
  move: boolean;
}

export enum RoomStatus {
  NEW_ROOM = 'New Room',
  ACTIVE = 'Active',
  DRAW = 'Draw',
  FINISHED = 'Finished',
  DELETED = 'Deleted',
}

export interface Stick {
  byPlayer: string;
}

export interface Box {
  byPlayer: string;
}

export interface RoomField {
  id: string;
  name: string;
  width: number;
  height: number;
  status: string;
  sticks: Stick[][];
  boxes: Box[][];
  roomPlayers: RoomPlayer[];
}

export interface RoomNotification {
  currentMoveId: string;
  roomName: string;
  roomId:  string;
  timestamp: number;
}

export enum AllRoomsTypes {
  GET_ROOMS_SUCCESS = 'GET_ROOMS_SUCCESS',
  SET_ACTIVE_ROOMS = 'SET_ACTIVE_ROOMS',
  SET_AVAILABLE_ROOMS = 'SET_AVAILABLE_ROOMS',
  GET_ROOMS_FAIL = 'GET_ROOMS_FAIL',
}

export enum CreateRoomTypes {
  CREATE_ROOM_SUCCESS = 'CREATE_ROOM_SUCCESS',
  CREATE_ROOM_FAIL = 'CREATE_ROOM_FAIL',
}

export const SET_FIELD_SUCCESS = 'SET_FIELD_SUCCESS';

export const SET_SCORE_SUCCESS = 'SET_SCORE_SUCCESS';

export const SET_PLAYER_SUCCESS = 'SET_PLAYER_SUCCESS';

export enum RoomNotificationTypes {
  ADD_ROOM_NOTIFICATION = 'ADD_ROOM_NOTIFICATIONS',
  UNABLE_ROOM_NOTIFICATION = 'UNABLE_ROOM_NOTIFICATION', 
}

interface AddRoomNotification {
  type: RoomNotificationTypes.ADD_ROOM_NOTIFICATION;
  payload: RoomNotification;
}

interface UnableRoomNotificaion {
  type: RoomNotificationTypes.UNABLE_ROOM_NOTIFICATION;
  payload: string;
}

export type RoomNotificationsActions = AddRoomNotification | UnableRoomNotificaion;

interface AllRoomsSuccess {
  type: AllRoomsTypes.GET_ROOMS_SUCCESS;
  payload: {
    availableRooms: object[],
    activeRooms: object[],
  };
}

interface SetAvailableRooms {
  type: AllRoomsTypes.SET_AVAILABLE_ROOMS;
  payload: object[];
}

interface SetActiveRooms {
  type: AllRoomsTypes.SET_ACTIVE_ROOMS;
  payload: object[];
}

interface AllRoomsFail {
  type: AllRoomsTypes.GET_ROOMS_FAIL;
  payload: {
    message: string;
  };
}

export type AllRoomsActions = AllRoomsSuccess | AllRoomsFail | SetAvailableRooms | SetActiveRooms;

interface CreateRoomSuccess {
  type: CreateRoomTypes.CREATE_ROOM_SUCCESS;
  payload: {
    message: string;
  };
}

interface CreateRoomFail {
  type: CreateRoomTypes.CREATE_ROOM_FAIL;
  payload: {
    message: string;
  };
}

export type CreateRoomActions = CreateRoomSuccess | CreateRoomFail;
