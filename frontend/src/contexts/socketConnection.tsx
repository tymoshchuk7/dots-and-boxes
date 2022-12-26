import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import config from '../config';
import { AllRoomsTypes, RoomNotificationTypes } from '../types/RoomTypes';

interface ContextInterface {
  socket: any;
  connectToSockets: () => void;
}

const socketConnectionContext = React.createContext<ContextInterface>(null as any);

export const useSocket = () => useContext(socketConnectionContext);

const proccess = (dispatch, type, body) => {
  switch (type) {
    case 'availableRooms':
      return dispatch({ type: AllRoomsTypes.SET_AVAILABLE_ROOMS, payload: body });
    case 'activeRooms':
      return dispatch({ type: AllRoomsTypes.SET_ACTIVE_ROOMS, payload: body });
    case 'moveNotification':
      dispatch({ type: RoomNotificationTypes.ADD_ROOM_NOTIFICATION, payload: body });
      return setTimeout(() => {
        dispatch({ type: RoomNotificationTypes.UNABLE_ROOM_NOTIFICATION, payload: body.roomId });
      }, 7000);
    default:
      return null;
  }
};

const CtxProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState({});
  const connectToSockets = () => {
    const initializedSocket = io(config.IO_API, {
      auth: {
        token: JSON.parse(localStorage.getItem('token') || '{}'),
      },
      transports: ['websocket'],
    });
    initializedSocket.on('MESSAGE', ({ type, body }) => proccess(dispatch, type, body));
    setSocket(initializedSocket);
  };
  return (
    <socketConnectionContext.Provider
      value={{
        socket,
        connectToSockets,
      }}
    >
      {children}
    </socketConnectionContext.Provider>
  );
};

export default CtxProvider;
