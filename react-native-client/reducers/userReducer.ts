import {
  UserSignUpTypes, UserSignUpActions,
  UserLogTypes, UserLogActions, UserVerifyActions,
  UserVerifyTypes, UserStatsTypes, UserStatsActions,
  UserLog, UserStats, UserVerify,
  UserSignUp,
  UserChangePasswordActions,
  UserChangePasswordTypes,
  UserChangeAvatarTypes,
  UserChangeAvatarActions,
} from '../types/UserTypes';

const initialSignUp: UserSignUp = {
  message: '',
  error: null,
};

export const signUpReducer = (state = initialSignUp, action: UserSignUpActions): UserSignUp => {
  switch (action.type) {
    case UserSignUpTypes.USER_SIGNUP_SUCCESS:
      return { message: action.payload, error: null };
    case UserSignUpTypes.USER_SIGNUP_FAIL:
      return { message: '', error: action.payload };
    default:
      return state;
  }
};

const initialLog: UserLog = {
  token: '',
  loading: false,
  error: null,
  auth: false,
};

export const logInReducer = (state = initialLog, action: UserLogActions): UserLog => {
  switch (action.type) {
    case UserLogTypes.USER_LOGIN_REQUEST:
      return { loading: true, token: '', error: null, auth: false };
    case UserLogTypes.USER_LOGIN_SUCCESS:
      const { token } = action.payload;
      return { loading: false, token, error: null, auth: true };
    case UserLogTypes.USER_LOGIN_FAIL:
      return { error: action.payload, token: '', loading: false, auth: false };
    case UserLogTypes.USER_LOGOUT:
      return { token: '', loading: false, auth: false }
    default:
      return state;
  }
};

const initialVerify: UserVerify = {
  auth: false,
  id: '',
  username: '',
  loading: false,
  error: null,
};

export const verifyReducer = (state = initialVerify, action: UserVerifyActions): UserVerify => {
  switch (action.type) {
    case UserVerifyTypes.USER_VERIFY_REQUEST:
      return {
        loading: true, auth: false, username: '', id: '', error: null,
      };
    case UserVerifyTypes.USER_VERIFY_SUCCESS:
      const { id, username, auth } = action.payload;
      return {
        loading: false, id, username, auth, error: null,
      };
    case UserVerifyTypes.USER_VERIFY_FAIL:
      const { message } = action.payload;
      return {
        error: message, id: '', username: '', loading: false, auth: false,
      };
    case UserVerifyTypes.USER_LOGOUT:
      return {
        loading: false, auth: false, username: '', id: '', error: null,
      }
    default:
      return state;
  }
};

const initialStats: UserStats = {
  wins: 0,
  defeats: 0,
  draws: 0,
  error: null,
};

export const statsReducer = (state = initialStats, action: UserStatsActions): UserStats => {
  switch (action.type) {
    case UserStatsTypes.USER_STATS_SUCCESS:
      const { wins, defeats, draws } = action.payload;
      return {
        wins, defeats, draws, error: null,
      };
    case UserStatsTypes.USER_STATS_FAIL:
      const { message } = action.payload;
      return {
        wins: 0, defeats: 0, draws: 0, error: message,
      };
    default:
      return state;
  }
};

export const changePasswordReducer = (state = {}, action: UserChangePasswordActions) => {
  switch (action.type) {
    case UserChangePasswordTypes.CHANGE_PASSWORD_SUCCESS:
      const { message } = action.payload;
      return { message, error: null };
    case UserChangePasswordTypes.CHANGE_PASSWORD_FAIL:
      const { message: errorMessage } = action.payload;
      return { message: '', error: errorMessage };
    default:
      return state;
  }
};

export const changeAvatarReducer = (state = {}, action: UserChangeAvatarActions) => {
  switch (action.type) {
    case UserChangeAvatarTypes.CHANGE_AVATAR_SUCCESS:
      const { message } = action.payload;
      return { message, error: null };
    case UserChangeAvatarTypes.CHANGE_AVATAR_FAIL:
      const { message: errorMessage } = action.payload;
      return { message: '', error: errorMessage };
    default:
      return state;
  }
};
