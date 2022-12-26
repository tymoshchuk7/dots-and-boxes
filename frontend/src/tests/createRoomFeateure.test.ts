import { screen } from '@testing-library/react';
import fetchMock from 'fetch-mock';
import config from '../config';
import { renderApp, sendChangeEvent, clickButtonWithText } from './featureTestsHelpers';

const createRoomUrl = `${config.ROOM_API}/create`;

describe('create room feature', () => {
  test('user creates room successfully', async () => {
    const { currentLocation, page: { getByText, findByText } } = renderApp({
      verifyUser: {
        auth: true,
      },
    });

    expect(currentLocation()).toBe('/');
    expect(getByText('Welcome!')).toBeInTheDocument();

    clickButtonWithText('Create room');
    expect(currentLocation()).toBe('/create');

    sendChangeEvent(
      screen.getByPlaceholderText('Some name'),
      'validRoomName',
    );
    sendChangeEvent(
      screen.getByLabelText('Input width of the field between 2 and 30'),
      '5',
    );
    sendChangeEvent(
      screen.getByLabelText('Input height of the field between 2 and 30'),
      '5',
    );

    fetchMock.post(createRoomUrl, { message: 'Successfully' });
    clickButtonWithText('Save');

    const modelText = await findByText(/Successfully/);
    expect(modelText).toBeInTheDocument();
    expect(currentLocation()).toBe('/');
    expect(fetchMock.called(createRoomUrl)).toBeTruthy();
    fetchMock.restore();
  });
});
