export interface UserLog {
  token: string;
  loading: boolean;
  error: null | string;
}

export interface UserSignUp {
  message: string;
  error: null | string;
}

export interface UserVerify {
  auth: boolean;
  id: string;
  username: string;
  loading: boolean
  error: null | string;
}

export interface UserStats {
  wins: number;
  defeats: number;
  draws: number;
  error: null | string;
}

export enum UserLogTypes {
  USER_LOGIN_REQUEST = 'USER_LOGIN_REQUEST',
  USER_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS',
  USER_LOGIN_FAIL = 'USER_LOGIN_FAIL',
}

export enum UserSignUpTypes {
  USER_SIGNUP_SUCCESS = 'USER_SIGNUP_SUCCESS',
  USER_SIGNUP_FAIL = 'USER_SIGNUP_FAIL',
}

export enum UserVerifyTypes {
  USER_VERIFY_REQUEST = 'USER_VERIFY_REQUEST',
  USER_VERIFY_SUCCESS = 'USER_VERIFY_SUCCESS',
  USER_VERIFY_FAIL = 'USER_VERIFY_FAIL',
  USER_LOGOUT = 'USER_LOGOUT',
}

export enum UserStatsTypes {
  USER_STATS_SUCCESS = 'USER_STATS_SUCCESS',
  USER_STATS_FAIL = 'USER_STATS_FAIL',
}

export enum UserChangePasswordTypes {
  CHANGE_PASSWORD_SUCCESS = 'CHANGE_PASSWORD_SUCCESS',
  CHANGE_PASSWORD_FAIL = 'CHANGE_PASSWORD_FAIL',
}

export enum UserChangeAvatarTypes {
  CHANGE_AVATAR_SUCCESS = 'CHANGE_AVATAR_SUCCESS',
  CHANGE_AVATAR_FAIL = 'CHANGE_AVATAR_FAIL',
}

interface UserLogInRequest {
  type: UserLogTypes.USER_LOGIN_REQUEST;
}

interface UserLogInSuccess {
  type: UserLogTypes.USER_LOGIN_SUCCESS;
  payload: {
    token: string;
  };
}

interface UserLogInFail {
  type: UserLogTypes.USER_LOGIN_FAIL;
  payload: string;
}

interface UserLogOut {
  type: UserVerifyTypes.USER_LOGOUT;
}

export type UserLogActions = UserLogInRequest | UserLogInSuccess
| UserLogInFail;

interface UserSignUpSuccess {
  type: UserSignUpTypes.USER_SIGNUP_SUCCESS;
  payload: string;
}

interface UserSignUpFail {
  type: UserSignUpTypes.USER_SIGNUP_FAIL;
  payload: string;
}

export type UserSignUpActions = UserSignUpSuccess | UserSignUpFail;

interface UserVerifyRequest {
  type: UserVerifyTypes.USER_VERIFY_REQUEST;
}

interface UserVerifySuccess {
  type: UserVerifyTypes.USER_VERIFY_SUCCESS;
  payload: {
    auth: boolean;
    id: string;
    username: string;
    avatar: string;
  };
}

interface UserVerifyFail {
  type: UserVerifyTypes.USER_VERIFY_FAIL;
  payload: {
    message: string;
  };
}

export type UserVerifyActions = UserVerifyRequest | UserVerifySuccess
| UserVerifyFail | UserLogOut;

interface UserStatsSuccess {
  type: UserStatsTypes.USER_STATS_SUCCESS;
  payload: {
    wins: number;
    defeats: number;
    draws: number;
  };
}

interface UserStatsFail {
  type: UserStatsTypes.USER_STATS_FAIL;
  payload: {
    message: string;
  };
}

export type UserStatsActions = UserStatsSuccess | UserStatsFail;

interface UserChangePasswordSuccess {
  type: UserChangePasswordTypes.CHANGE_PASSWORD_SUCCESS;
  payload: {
    message: string,
  };
}

interface UserChangePasswordFail {
  type: UserChangePasswordTypes.CHANGE_PASSWORD_FAIL;
  payload: {
    message: string,
  };
}

export type UserChangePasswordActions = UserChangePasswordSuccess | UserChangePasswordFail;

interface UserChangeAvatarSuccess {
  type: UserChangeAvatarTypes.CHANGE_AVATAR_SUCCESS;
  payload: {
    message: string,
    avatar: string,
  };
}

interface UserChangeAvatarFail {
  type: UserChangeAvatarTypes.CHANGE_AVATAR_FAIL;
  payload: {
    message: string,
  };
}

export type UserChangeAvatarActions = UserChangeAvatarSuccess | UserChangeAvatarFail;
