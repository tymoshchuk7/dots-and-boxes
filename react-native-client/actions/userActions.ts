import { Dispatch } from 'redux';
import {
  UserLogActions, UserLogTypes,
  UserSignUpTypes, UserSignUpActions,
  UserStatsTypes, UserVerifyActions,
  UserVerifyTypes, UserStatsActions, UserChangePasswordActions,
  UserChangePasswordTypes, UserChangeAvatarActions, UserChangeAvatarTypes,
} from '../types/UserTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ModalTypes from '../types/WidgetTypes';
import config from '../config';
import request from './requestFunc';

export const signUpAction = (payload: any,
  success: () => void) => (dispatch: Dispatch<UserSignUpActions>) => {
    const params = {
      url: `${config.USER_API}/registration`,
      SUCCESS_ACTION: UserSignUpTypes.USER_SIGNUP_SUCCESS,
      FAIL_ACTION: UserSignUpTypes.USER_SIGNUP_FAIL,
      body: payload,
      success,
    };
    return request(params, dispatch);
  };

export const logInAction = (payload: any,
  success: (arg: any) => void) => async (dispatch: Dispatch<UserLogActions>) => {
    const saveToken = async (response: any) => {
      if (response.token) await AsyncStorage.setItem('token', response.token);
      success(response);
    };
    const params = {
      url: `${config.USER_API}/auth`,
      SUCCESS_ACTION: UserLogTypes.USER_LOGIN_SUCCESS,
      FAIL_ACTION: UserLogTypes.USER_LOGIN_FAIL,
      body: payload,
      success: saveToken,
    };
    dispatch({ type: UserLogTypes.USER_LOGIN_REQUEST });
    return request(params, dispatch);
  };

export const verifyAction = () => (dispatch: Dispatch<UserVerifyActions>) => {
  const params = {
    url: `${config.USER_API}/verify`,
    SUCCESS_ACTION: UserVerifyTypes.USER_VERIFY_SUCCESS,
    FAIL_ACTION: UserVerifyTypes.USER_VERIFY_FAIL,
  };
  dispatch({ type: UserVerifyTypes.USER_VERIFY_REQUEST });
  return request(params, dispatch);
};

export const getStatsAction = () => (dispatch: Dispatch<UserStatsActions>) => {
  const params = {
    url: `${config.USER_API}/stats`,
    SUCCESS_ACTION: UserStatsTypes.USER_STATS_SUCCESS,
    FAIL_ACTION: UserStatsTypes.USER_STATS_FAIL,
    body: {},
  };
  return request(params, dispatch);
};

export const changePasswordAction = (payload: any,
  success: () => void) => (dispatch: Dispatch<UserChangePasswordActions>) => {
    const params = {
      url: `${config.USER_API}/change_password`,
      SUCCESS_ACTION: UserChangePasswordTypes.CHANGE_PASSWORD_SUCCESS,
      FAIL_ACTION: UserChangePasswordTypes.CHANGE_PASSWORD_FAIL,
      body: payload,
      success,
    };
    return request(params, dispatch);
  };

export const changeAvatarAction = (payload: any,
  success: () => void) => (dispatch: Dispatch<UserChangeAvatarActions>) => {
    const params = {
      url: `${config.USER_API}/change_avatar`,
      SUCCESS_ACTION: UserChangeAvatarTypes.CHANGE_AVATAR_SUCCESS,
      FAIL_ACTION: UserChangeAvatarTypes.CHANGE_AVATAR_FAIL,
      body: payload,
      success,
    };
    return request(params, dispatch);
  };

export const logOutAction = () => async (dispatch: any) => {
  await AsyncStorage.removeItem('token');
  dispatch({ type: UserVerifyTypes.USER_LOGOUT });
};

export const closeModalAction = () => ({ type: ModalTypes.CLOSE_MODAL });
