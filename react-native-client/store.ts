import {
  createStore, combineReducers, applyMiddleware, compose,
} from 'redux';
import thunk from 'redux-thunk';
import {
  logInReducer, signUpReducer, verifyReducer,
  statsReducer, changePasswordReducer, changeAvatarReducer,
} from './reducers/userReducer';
import {
  createRoomReducer, allRoomsReducer,
  RoomNotificationReducer, playerReducer,
  scoreReducer, gameReducer
} from './reducers/roomReducer';
import { modalReducer, indicatorReducer } from './reducers/widgetReducer';

const reducer = combineReducers({
  logInUser: logInReducer,
  signUpUser: signUpReducer,
  verifyUser: verifyReducer,
  allRooms: allRoomsReducer,
  createRoom: createRoomReducer,
  modal: modalReducer,
  stats: statsReducer,
  changePassword: changePasswordReducer,
  changeAvatar: changeAvatarReducer,
  RoomNotifications: RoomNotificationReducer,
  NotificationsIndicator: indicatorReducer,
  player: playerReducer,
  score: scoreReducer,
  game: gameReducer,
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
