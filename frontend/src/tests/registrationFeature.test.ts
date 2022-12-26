import { screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import config from '../config';
import {
  renderApp, sendChangeEvent, clickButtonWithText,
  buildJsonResponse,
} from './featureTestsHelpers';

const registrationUrl = `${config.USER_API}/registration`;

describe('registration feature test', () => {
  test('user sign up successfully', async () => {
    const { currentLocation, page: { getByText, findByText } } = renderApp();

    expect(currentLocation()).toBe('/login');
    expect(getByText('Log in')).toBeInTheDocument();

    clickButtonWithText('Sign up');
    expect(currentLocation()).toBe('/registration');

    sendChangeEvent(
      screen.getByPlaceholderText('Enter username'),
      'validUsername',
    );
    sendChangeEvent(
      screen.getByPlaceholderText('Enter email'),
      'existing@email.com',
    );
    sendChangeEvent(
      screen.getByPlaceholderText('Password'),
      'validPassword',
    );

    fetchMock.post(registrationUrl, { message: 'Successfully' });
    clickButtonWithText('Sign up');

    const modalText = await findByText(/Successfully/);
    expect(modalText).toBeInTheDocument();
    expect(currentLocation()).toBe('/login');
    expect(fetchMock.called(registrationUrl)).toBeTruthy();
    fetchMock.restore();
  });

  test('user sign up with invalid credentionals', async () => {
    const { currentLocation, page: { getByText, findByText } } = renderApp();

    expect(currentLocation()).toBe('/login');
    expect(getByText('Log in')).toBeInTheDocument();

    clickButtonWithText('Sign up');
    expect(currentLocation()).toBe('/registration');

    sendChangeEvent(
      screen.getByPlaceholderText('Enter username'),
      'validUsername',
    );
    sendChangeEvent(
      screen.getByPlaceholderText('Enter email'),
      'existing@email.com',
    );
    sendChangeEvent(
      screen.getByPlaceholderText('Password'),
      'validPassword',
    );

    fetchMock.post(
      registrationUrl,
      buildJsonResponse({
        message: 'User already exists',
      }, 400),
    );
    clickButtonWithText('Sign up');

    const modalText = await findByText(/User already exists/);
    expect(modalText).toBeInTheDocument();
    expect(currentLocation()).toBe('/registration');
    expect(fetchMock.called(registrationUrl)).toBeTruthy();
    fetchMock.restore();
  });
});
