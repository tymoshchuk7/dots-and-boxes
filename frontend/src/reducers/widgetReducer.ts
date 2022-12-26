import Modal, { NotificationsIndicator } from '../types/WidgetTypes';

export const modalReducer = (state = {}, action: any) => {
  switch (action.type) {
    case Modal.OPEN_MODAL:
      return { show: true, message: action.payload };
    case Modal.CLOSE_MODAL:
      return { show: false };
    default:
      return state;
  }
};

export const indicatorReducer = (state = false, action: any) => {
  switch (action.type) {
    case NotificationsIndicator.OPEN_NOTIFICATOR:
      return true;
    case NotificationsIndicator.CLOSE_NOTIFICATOR:
      return false;
    default:
      return state;
  }
};
