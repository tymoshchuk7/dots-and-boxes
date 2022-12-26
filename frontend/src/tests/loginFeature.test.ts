import { screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import config from '../config';
import {
  renderApp, sendChangeEvent, clickButtonWithText,
  buildJsonResponse,
} from './featureTestsHelpers';

const authorizationUrl = `${config.USER_API}/auth`;
const verifyUrl = `${config.USER_API}/verify`;

describe('login feature test', () => {
  test('user logs in successfully', async () => {
    const { currentLocation, page: { getByText, findByText } } = renderApp();

    expect(currentLocation()).toBe('/login');
    expect(getByText('Log in')).toBeInTheDocument();

    sendChangeEvent(
      screen.getByPlaceholderText('Enter email'),
      'existing@email.com',
    );
    sendChangeEvent(
      screen.getByPlaceholderText('Password'),
      'validPassword',
    );

    fetchMock.post(authorizationUrl, { token: 'some token' });
    fetchMock.post(verifyUrl, { auth: true });
    clickButtonWithText('Log in');

    const text = await findByText(/Welcome/);
    expect(text).toBeInTheDocument();
    expect(currentLocation()).toBe('/');
    expect(fetchMock.called(authorizationUrl)).toBeTruthy();
    fetchMock.restore();
  });
  test('user is not able to log in with invalid credentials', async () => {
    const { currentLocation, page: { getByText, findByText } } = renderApp();

    expect(currentLocation()).toBe('/login');
    expect(getByText('Log in')).toBeInTheDocument();

    sendChangeEvent(
      screen.getByPlaceholderText('Enter email'),
      'existing@email.com',
    );
    sendChangeEvent(
      screen.getByPlaceholderText('Password'),
      'validPassword',
    );

    fetchMock.post(authorizationUrl, buildJsonResponse({
      message: 'Invalid email',
    }, 400));
    clickButtonWithText('Log in');

    const text = await findByText(/Invalid email/);
    expect(text).toBeInTheDocument();
    expect(currentLocation()).toBe('/login');
    expect(fetchMock.called(authorizationUrl)).toBeTruthy();
    fetchMock.restore();
  });
});
