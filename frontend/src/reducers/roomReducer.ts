import {
  AllRoomsActions, AllRoomsTypes, AllRooms,
  CreateRoomTypes, CreateRoomActions, CreateRoom,
  SET_FIELD_SUCCESS, SET_PLAYER_SUCCESS, SET_SCORE_SUCCESS,
  RoomField, RoomPlayer, RoomNotificationTypes,
  RoomNotificationsActions,
} from '../types/RoomTypes';

const initialAllRooms: AllRooms = {
  available: [],
  active: [],
  error: null,
};

export const allRoomsReducer = (state = initialAllRooms, action: AllRoomsActions): AllRooms => {
  switch (action.type) {
    case AllRoomsTypes.GET_ROOMS_SUCCESS:
      const { availableRooms, activeRooms } = action.payload;
      return { available: availableRooms, active: activeRooms, error: null };
    case AllRoomsTypes.GET_ROOMS_FAIL:
      const { message } = action.payload;
      return { error: message, available: [], active: [] };
    case AllRoomsTypes.SET_AVAILABLE_ROOMS:
      return { ...state, available: action.payload };
    case AllRoomsTypes.SET_ACTIVE_ROOMS:
      return { ...state, active: action.payload };
    default:
      return state;
  }
};

const initialCreateRoom: CreateRoom = {
  message: '',
  error: null,
};

export const createRoomReducer = (state = initialCreateRoom,
  action: CreateRoomActions): CreateRoom => {
  switch (action.type) {
    case CreateRoomTypes.CREATE_ROOM_SUCCESS:
      const { message } = action.payload;
      return { message, error: null };
    case CreateRoomTypes.CREATE_ROOM_FAIL:
      const { payload } = action;
      return { message: '', error: payload.message };
    default:
      return state;
  }
};

const initialField: RoomField = {
  id: '',
  name: '',
  width: 3,
  status: '',
  height: 3,
  boxes: [],
  sticks: [],
  roomPlayers: [],
};

export const getFieldReducer = (state = initialField,
  action: { type: typeof SET_FIELD_SUCCESS, payload: RoomField })
: RoomField => {
  switch (action.type) {
    case SET_FIELD_SUCCESS:
      const {
        id,
        name,
        width,
        status,
        height,
        boxes,
        sticks,
        roomPlayers,
      } = action.payload;
      return {
        id,
        name,
        width,
        height,
        status,
        sticks,
        boxes,
        roomPlayers,
      };
    default:
      return state;
  }
};

export const getScoreReducer = (state = {}, action: any): object => {
  switch (action.type) {
    case SET_SCORE_SUCCESS:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};

const initialPlayer: RoomPlayer = {
  id: '',
  userId: '',
  roomId: '',
  avatar: '',
  playername: '',
  winner: false,
  creator: false,
  move: false,
};

export const playerReducer = (state = initialPlayer,
  action: { type: typeof SET_PLAYER_SUCCESS, payload: RoomPlayer })
: RoomPlayer => {
  switch (action.type) {
    case SET_PLAYER_SUCCESS:
      const {
        id,
        userId,
        roomId,
        playername,
        winner,
        creator,
        move,
        avatar,
      } = action.payload;
      return {
        id, playername, winner, creator, move, userId, roomId, avatar,
      };
    default:
      return state;
  }
};

export const RoomNotificationReducer = (state = {},
  action: RoomNotificationsActions) => {
  switch (action.type) {
    case RoomNotificationTypes.ADD_ROOM_NOTIFICATION:
      const notifications = { ...state };
      const { roomId, roomName, currentMoveId } = action.payload;
      notifications[roomId] = { roomName, currentMoveId, visibility: true };
      return notifications;
    case RoomNotificationTypes.UNABLE_ROOM_NOTIFICATION:
      const notifications2 = { ...state };
      notifications2[action.payload].visibility = false;
      return notifications2;
    default:
      return state;
  }
};
