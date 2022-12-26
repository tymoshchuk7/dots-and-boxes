import Modal from '../types/WidgetTypes';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RequestPayload {
  url: string;
  SUCCESS_ACTION: string;
  FAIL_ACTION: string;
  body?: any;
  success?: (arg: any) => void;
  fail?: (arg: any) => void;
}

const preapareJsonParams = (body: any, token: string) => ({
  body: JSON.stringify({...body, token}),
  headers: {
    'Content-Type': 'application/json',
  },
});

const prepareFormData = (body: any, token: string) => {
  body.append('token', token);
  return { body };
}

const makeRequest = async ({ url, body }: any) => {
  const isFormData = body instanceof FormData;
  const token = await AsyncStorage.getItem('token');
  const formatterFn = isFormData ? prepareFormData : preapareJsonParams;
  const response = await fetch(url, {
    ...formatterFn(body, token || ''),
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
      if (fail) fail(result);
      if (result.message) {
        dispatch({ type: Modal.OPEN_MODAL, payload: result.message });
        setTimeout(() => {
          dispatch({ type: Modal.CLOSE_MODAL });
        }, 2500);
      }
      return result;
    });
}
