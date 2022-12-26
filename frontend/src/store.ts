import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
import {
  logInReducer, signUpReducer, verifyReducer,
  statsReducer, changePasswordReducer, changeAvatarReducer,
} from './reducers/userReducer';
import {
  createRoomReducer, allRoomsReducer, getFieldReducer,
  getScoreReducer, playerReducer, RoomNotificationReducer,
} from './reducers/roomReducer';
import { modalReducer, indicatorReducer } from './reducers/widgetReducer';

const reducer = combineReducers({
  logInUser: logInReducer,
  signUpUser: signUpReducer,
  verifyUser: verifyReducer,
  allRooms: allRoomsReducer,
  createRoom: createRoomReducer,
  game: getFieldReducer,
  score: getScoreReducer,
  modal: modalReducer,
  stats: statsReducer,
  player: playerReducer,
  changePassword: changePasswordReducer,
  changeAvatar: changeAvatarReducer,
  RoomNotifications: RoomNotificationReducer,
  NotificationsIndicator: indicatorReducer,
});

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const storeCreator = (state = {}) => createStore(
  reducer,
  state,
  composeEnhancer(applyMiddleware(thunk)),
);

const store = storeCreator();

export default store;
