import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { render, fireEvent, screen } from '@testing-library/react';
import configureMockStore from 'redux-mock-store';
import Auth from '../views/authPage';
import { fakeLocalStorage } from './fakeLocalStorage';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('auth page test', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: fakeLocalStorage,
    });
  });
  test('log in action should be called on button click', () => {
    const testStore = mockStore({
      logInUser: {
        loading: false,
      },
    });
    render(
      <Provider store={testStore}>
        <BrowserRouter>
          <Auth />
        </BrowserRouter>
      </Provider>,
    );
    const email = screen.getByPlaceholderText('Enter email');
    fireEvent.change(email, { target: { value: 'test@gmail.com' } });
    expect(email.value).toBe('test@gmail.com');
    const password = screen.getByPlaceholderText('Password');
    fireEvent.change(password, { target: { value: '88888888' } });
    expect(password.value).toBe('88888888');
    const btn = screen.getByText(/Log in/i);
    fireEvent.click(btn);
  });
});
