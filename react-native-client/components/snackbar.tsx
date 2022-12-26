import * as React from 'react';
import { Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RoomNotificationTypes } from '../types/RoomTypes';
import * as RootNavigation from '../navigation/rootNavigation';
import { push } from '../navigation/rootNavigation';

const NotificationSnackbar: React.FC = () => {
  const { id } = useSelector((state: any) => state.verifyUser);
  const notifications = useSelector((state: any) => state.RoomNotifications);
  const dispatch = useDispatch();
  const onDismissSnackBar = (id: string) =>
    dispatch({ type: RoomNotificationTypes.UNABLE_ROOM_NOTIFICATION, payload: id });
  const roomIds = Object.keys(notifications);

  return (
    <>
      {roomIds.map((roomId) => {
        if (notifications[roomId].currentMoveId === id) {
          return (
            <Snackbar
              style={{
                zIndex: 100000
              }}
              key={roomId}
              visible={notifications[roomId].visibility}
              onDismiss={() => onDismissSnackBar(roomId)}
              action={{
                label: 'Go',
                onPress: () => {
                  push('Room', { id: roomId });
                },
              }}>
              {notifications[roomId].roomName}, Your turn to move
            </Snackbar>
          )
        }
      })}
    </>
  );
};

export default NotificationSnackbar;