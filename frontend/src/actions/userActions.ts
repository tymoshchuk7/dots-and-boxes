import { Dispatch } from 'redux';
import {
  UserLogActions, UserLogTypes,
  UserSignUpTypes, UserSignUpActions,
  UserStatsTypes, UserVerifyActions,
  UserVerifyTypes, UserStatsActions, UserChangePasswordActions,
  UserChangePasswordTypes, UserChangeAvatarActions, UserChangeAvatarTypes,
} from '../types/UserTypes';
import ModalTypes from '../types/WidgetTypes';
import config from '../config';
import request from './requestFunc';

export const signUpAction = (payload: any,
  success: () => void) => async (dispatch: Dispatch<UserSignUpActions>) => {
  try {
    const params = {
      url: `${config.USER_API}/registration`,
      SUCCESS_ACTION: UserSignUpTypes.USER_SIGNUP_SUCCESS,
      FAIL_ACTION: UserSignUpTypes.USER_SIGNUP_FAIL,
      body: payload,
      success,
    };
    await request(params, dispatch);
  } catch (error) {
    dispatch({ type: UserSignUpTypes.USER_SIGNUP_FAIL, payload: error });
  }
};

export const logInAction = (payload: any) => async (dispatch: Dispatch<UserLogActions>) => {
  try {
    const params = {
      url: `${config.USER_API}/auth`,
      SUCCESS_ACTION: UserLogTypes.USER_LOGIN_SUCCESS,
      FAIL_ACTION: UserLogTypes.USER_LOGIN_FAIL,
      body: payload,
    };
    dispatch({ type: UserLogTypes.USER_LOGIN_REQUEST });
    const response = await request(params, dispatch);
    if (response.token) localStorage.setItem('token', JSON.stringify(response.token));
  } catch (error) {
    dispatch({ type: UserLogTypes.USER_LOGIN_FAIL, payload: error.message });
  }
};

export const verifyAction = () => async (dispatch: Dispatch<UserVerifyActions>) => {
  try {
    if (!localStorage.getItem('token')) {
      return;
    }
    const payload = {
      token: JSON.parse(localStorage.getItem('token') || '{}'),
    };
    const params = {
      url: `${config.USER_API}/verify`,
      SUCCESS_ACTION: UserVerifyTypes.USER_VERIFY_SUCCESS,
      FAIL_ACTION: UserVerifyTypes.USER_VERIFY_FAIL,
      body: payload,
    };
    dispatch({ type: UserVerifyTypes.USER_VERIFY_REQUEST });
    await request(params, dispatch);
  } catch (error) {
    dispatch({ type: UserVerifyTypes.USER_VERIFY_FAIL, payload: error.message });
  }
};

export const getStatsAction = () => async (dispatch: Dispatch<UserStatsActions>) => {
  try {
    const payload = {
      token: JSON.parse(localStorage.getItem('token') || '{}'),
    };
    const params = {
      url: `${config.USER_API}/stats`,
      SUCCESS_ACTION: UserStatsTypes.USER_STATS_SUCCESS,
      FAIL_ACTION: UserStatsTypes.USER_STATS_FAIL,
      body: payload,
    };
    await request(params, dispatch);
  } catch (error) {
    dispatch({ type: UserStatsTypes.USER_STATS_FAIL, payload: error.message });
  }
};

export const changePasswordAction = (payload,
  success: () => void) => async (dispatch: Dispatch<UserChangePasswordActions>) => {
  try {
    const payloadWithToken = Object.assign(
      payload,
      { token: JSON.parse(localStorage.getItem('token') || '{}') },
    );
    const params = {
      url: `${config.USER_API}/change_password`,
      SUCCESS_ACTION: UserChangePasswordTypes.CHANGE_PASSWORD_SUCCESS,
      FAIL_ACTION: UserChangePasswordTypes.CHANGE_PASSWORD_FAIL,
      body: payloadWithToken,
      success,
    };
    await request(params, dispatch);
  } catch (error) {
    dispatch({ type: UserChangePasswordTypes.CHANGE_PASSWORD_FAIL, payload: error.message });
  }
};

export const changeAvatarAction = (payload,
  success: () => void) => async (dispatch: Dispatch<UserChangeAvatarActions>) => {
  try {
    payload.append('token', JSON.parse(localStorage.getItem('token') || '{}'));
    const params = {
      url: `${config.USER_API}/change_avatar`,
      SUCCESS_ACTION: UserChangeAvatarTypes.CHANGE_AVATAR_SUCCESS,
      FAIL_ACTION: UserChangeAvatarTypes.CHANGE_AVATAR_FAIL,
      body: payload,
      success,
    };
    await request(params, dispatch);
  } catch (error) {
    dispatch({ type: UserChangeAvatarTypes.CHANGE_AVATAR_FAIL, payload: error.message });
  }
};

export const logOutAction = () => {
  localStorage.removeItem('token');
  return ({ type: UserVerifyTypes.USER_LOGOUT });
};

export const closeModalAction = () => ({ type: ModalTypes.CLOSE_MODAL });
