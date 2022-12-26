import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Main from '../views/mainPage';
import { fakeLocalStorage } from './fakeLocalStorage';

describe('main page test', () => {
  const middlewares = [thunk];
  let testStore;
  const mockStore = configureStore(middlewares);
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: fakeLocalStorage,
    });
  });
  beforeEach(() => {
    testStore = mockStore({
      allRooms: {
        available: [],
        active: [],
      },
      stats: {
        wins: 3,
        defeats: 2,
        draws: 4,
      },
    });
    testStore.dispatch = jest.fn();
    render(
      <Provider store={testStore}>
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </Provider>,
    );
  });
  test('get rooms and get stats actions should be called when rendering page', () => {
    expect(testStore.dispatch).toHaveBeenCalledTimes(2);
  });
});
