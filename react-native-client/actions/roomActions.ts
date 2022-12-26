import { Dispatch } from 'redux';
import {
  AllRoomsActions, AllRoomsTypes,
  CreateRoomTypes, CreateRoomActions, SET_PLAYER_SUCCESS,
  SET_SCORE_SUCCESS, SET_FIELD_SUCCESS,
} from '../types/RoomTypes';
import config from '../config';
import request from './requestFunc';

export const getRoomsAction = () => (dispatch: Dispatch<AllRoomsActions>) => {
  const params = {
    url: `${config.ROOM_API}/all`,
    SUCCESS_ACTION: AllRoomsTypes.GET_ROOMS_SUCCESS,
    FAIL_ACTION: AllRoomsTypes.GET_ROOMS_FAIL,
  };
  return request(params, dispatch);
};

export const createRoomAction = (payload: any,
  success: () => void) => (dispatch: Dispatch<CreateRoomActions>) => {
    const params = {
      url: `${config.ROOM_API}/create`,
      SUCCESS_ACTION: CreateRoomTypes.CREATE_ROOM_SUCCESS,
      FAIL_ACTION: CreateRoomTypes.CREATE_ROOM_FAIL,
      body: payload,
      success,
    };
    return request(params, dispatch);
  };

export const setGameAction = (game: any) => ({ type: SET_FIELD_SUCCESS, payload: game });

export const setScoreAcion = (score: any) => ({ type: SET_SCORE_SUCCESS, payload: score });

export const setPlayerAction = (player: any) => ({ type: SET_PLAYER_SUCCESS, payload: player });
