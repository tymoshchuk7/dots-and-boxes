import { Dispatch } from 'redux';
import {
  AllRoomsActions, AllRoomsTypes,
  CreateRoomTypes, CreateRoomActions, SET_PLAYER_SUCCESS,
  SET_SCORE_SUCCESS, SET_FIELD_SUCCESS,
} from '../types/RoomTypes';
import config from '../config';
import request from './requestFunc';

export const getRoomsAction = () => async (dispatch: Dispatch<AllRoomsActions>) => {
  try {
    const payload = {
      token: JSON.parse(localStorage.getItem('token') || '{}'),
    };
    const params = {
      url: `${config.ROOM_API}/all`,
      SUCCESS_ACTION: AllRoomsTypes.GET_ROOMS_SUCCESS,
      FAIL_ACTION: AllRoomsTypes.GET_ROOMS_FAIL,
      body: payload,
    };
    await request(params, dispatch);
  } catch (error) {
    dispatch({ type: AllRoomsTypes.GET_ROOMS_FAIL, payload: error.message });
  }
};

export const createRoomAction = (payload: any,
  success: () => void) => async (dispatch: Dispatch<CreateRoomActions>) => {
  try {
    const payloadWithToken = Object.assign(
      payload,
      { token: JSON.parse(localStorage.getItem('token') || '{}') },
    );
    const params = {
      url: `${config.ROOM_API}/create`,
      SUCCESS_ACTION: CreateRoomTypes.CREATE_ROOM_SUCCESS,
      FAIL_ACTION: CreateRoomTypes.CREATE_ROOM_FAIL,
      body: payloadWithToken,
      success,
    };
    await request(params, dispatch);
  } catch (error) {
    dispatch({ type: CreateRoomTypes.CREATE_ROOM_FAIL, payload: error.message });
  }
};

export const setGameAction = (game: any) => ({ type: SET_FIELD_SUCCESS, payload: game });

export const setScoreAcion = (score: any) => ({ type: SET_SCORE_SUCCESS, payload: score });

export const setPlayerAction = (player: any) => ({ type: SET_PLAYER_SUCCESS, payload: player });
