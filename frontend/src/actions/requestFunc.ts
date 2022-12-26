import Modal from '../types/WidgetTypes';
import { UserChangeAvatarTypes, UserVerifyTypes } from '../types/UserTypes';

interface RequestPayload {
  url: string;
  SUCCESS_ACTION: string;
  FAIL_ACTION: string;
  body: any;
  success?: (arg: any) => void;
  fail?: (arg: any) => void;
}

const preapareJsonParams = (body) => ({
  body: JSON.stringify(body),
  headers: {
    'Content-Type': 'application/json',
  },
});

const prepareFormData = (body) => ({
  body,
});

const makeRequest = async ({ url, body }) => {
  const isFormData = body instanceof FormData;
  const formatterFn = isFormData ? prepareFormData : preapareJsonParams;
  const response = await fetch(url, {
    ...formatterFn(body),
    method: 'Post',
  });
  const result = await response.json();
  if (!response.ok) {
    throw result;
  }
  return result;
};

export default async function request({
  url, SUCCESS_ACTION, FAIL_ACTION, body, success, fail,
}: RequestPayload,
dispatch: any) {
  return makeRequest({
    url,
    body,
  })
    .then((result) => {
      dispatch({ type: SUCCESS_ACTION, payload: result });
      if (SUCCESS_ACTION === UserVerifyTypes.USER_VERIFY_SUCCESS) {
        dispatch({ type: UserChangeAvatarTypes.CHANGE_AVATAR_SUCCESS, payload: result });
      }
      if (success) success(result);
      if (result.message) {
        dispatch({ type: Modal.OPEN_MODAL, payload: result.message });
        setTimeout(() => {
          dispatch({ type: Modal.CLOSE_MODAL });
        }, 2500);
      }
      return result;
    })
    .catch((result) => {
      dispatch({ type: FAIL_ACTION, payload: result.message });
      dispatch({ type: Modal.OPEN_MODAL, payload: result.message });
      if (fail) fail(result);
      setTimeout(() => {
        dispatch({ type: Modal.CLOSE_MODAL });
      }, 2500);
      return result;
    });
}
