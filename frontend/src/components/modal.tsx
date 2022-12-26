import React from 'react';
import { Modal } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { closeModalAction } from '../actions/userActions';

const MessageModal: React.FC = () => {
  const { show, message } = useSelector((state: any) => state.modal);
  const dispatch = useDispatch();

  return (
    <Modal
      show={show}
      onHide={() => dispatch(closeModalAction())}
      backdrop="static"
      backdropClassName="backdrop-custom-class"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-dark">Read the information below</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-dark">
        {message}
      </Modal.Body>
    </Modal>
  );
};

export default MessageModal;
