import React from 'react';
import { useSelector } from 'react-redux';
import { Toast } from 'react-bootstrap';

const NotiificationsContainer: React.FC = () => {
  const roomNotifications = useSelector((state: any) => state.RoomNotifications);
  const { id } = useSelector((state: any) => state.verifyUser);
  const roomIds = Object.keys(roomNotifications);

  return (
    <div
      className="d-flex flex-row-reverse"
      style={{ position: 'absolute', right: 10, bottom: 10 }}
    >
      <div>
        {roomIds.map((roomId) => {
          if (
            roomNotifications[roomId].visibility
            && roomNotifications[roomId].currentMoveId === id
          ) {
            return (
              <Toast>
                <Toast.Header closeButton className="d-flex justify-content-between">
                  <strong className="me-auto">{roomNotifications[roomId].roomName}</strong>
                </Toast.Header>
                <Toast.Body style={{ color: '#000' }}>Your turn to move</Toast.Body>
              </Toast>
            );
          }
          return '';
        })}
      </div>
    </div>
  );
};

export default NotiificationsContainer;
