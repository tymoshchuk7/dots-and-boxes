import React, { useContext, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dispatch } from 'redux';
import { io } from 'socket.io-client';
import config from '../config';
import { AllRoomsTypes, RoomNotificationTypes } from '../types/RoomTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ContextInterface {
  socket: any;
  connectToSockets: () => void;
}

interface EventInterface {
  type: string;
  body: any;
}

const socketConnectionContext = React.createContext<ContextInterface>(null as any);

export const useSocket = () => useContext(socketConnectionContext);

const proccess = (dispatch: Dispatch, type: string, body: any) => {
  switch (type) {
    case 'availableRooms':
      return dispatch({ type: AllRoomsTypes.SET_AVAILABLE_ROOMS, payload: body });
    case 'activeRooms':
      return dispatch({ type: AllRoomsTypes.SET_ACTIVE_ROOMS, payload: body });
    case 'moveNotification':
      return dispatch({ type: RoomNotificationTypes.ADD_ROOM_NOTIFICATION, payload: body });
    default:
      return null;
  }
};

const CtxProvider: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState({});
  const connectToSockets = async () => {
    const initializedSocket = io(config.IO_API, {
      auth: {
        token: await AsyncStorage.getItem('token') || '{}',
      },
      transports: ['websocket'],
    });
    initializedSocket.on(
      'MESSAGE',
      ({ type, body }: EventInterface) => proccess(dispatch, type, body)
    );
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
