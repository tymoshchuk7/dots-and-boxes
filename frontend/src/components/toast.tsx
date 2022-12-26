import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toast } from 'react-bootstrap';

interface MoveToastInterface {
  showToast: boolean;
  closeToast: () => void;
}

const MoveToast: React.FC<MoveToastInterface> = ({
  showToast, closeToast,
}) => {
  const notificationList = useSelector((state: any) => state.RoomNotifications);
  const { id } = useSelector((state: any) => state.verifyUser);
  const roomIds = Object.keys(notificationList);

  return (
    <Toast
      show={showToast}
      onClose={closeToast}
      className="toast-own"
    >
      <Toast.Header>
        <strong className="me-auto">Notifications</strong>
      </Toast.Header>
      <Toast.Body>
        {roomIds.map((room) => (
          <div className="d-flex flex-row">
            <Link
              to={`/room/${room}`}
              className="mr-1"
            >
              {notificationList[room].roomName}
            </Link>
            <div>
              {notificationList[room].currentMoveId === id
                ? 'Your turn to move' : 'Another player has move'}
            </div>
          </div>
        ))}
      </Toast.Body>
    </Toast>
  );
};

export default MoveToast;
