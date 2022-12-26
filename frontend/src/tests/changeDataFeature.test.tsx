import { screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import config from '../config';
import { renderApp, clickButtonWithText, sendChangeEvent } from './featureTestsHelpers';

const changePasswordUrl = `${config.USER_API}/change_password`;

describe('change password feature', () => {
  test('user changes password successfully', async () => {
    const { currentLocation, page: { getByText, findByText } } = renderApp({
      verifyUser: {
        auth: true,
      },
    });

    expect(currentLocation()).toBe('/');
    expect(getByText('Welcome!')).toBeInTheDocument();

    clickButtonWithText('Change data');
    expect(currentLocation()).toBe('/change');

    sendChangeEvent(
      screen.getByPlaceholderText('Old password'),
      'oldPassword',
    );
    sendChangeEvent(
      screen.getByPlaceholderText('New password'),
      'newValidPassword',
    );
    sendChangeEvent(
      screen.getByPlaceholderText('Repeat new password'),
      'newValidPassword',
    );

    fetchMock.post(changePasswordUrl, { message: 'Successfully' });
    clickButtonWithText('Change password');

    const modalText = await findByText(/Successfully/);
    expect(modalText).toBeInTheDocument();
    expect(currentLocation()).toBe('/');
    expect(fetchMock.called(changePasswordUrl)).toBeTruthy();
    fetchMock.restore();
  });
});
