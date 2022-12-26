import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Registration from '../views/registrationPage';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);
global.fetch = jest.fn();

describe('registration page test', () => {
  test('sign up action shold be called on button click', () => {
    const testStore = mockStore({
      logInUser: {
        loading: false,
      },
    });
    render(
      <Provider store={testStore}>
        <BrowserRouter>
          <Registration />
        </BrowserRouter>
      </Provider>,
    );
    const username = screen.getByPlaceholderText('Enter username');
    fireEvent.change(username, { target: { value: 'Steve' } });
    expect(username.value).toBe('Steve');
    const email = screen.getByPlaceholderText('Enter email');
    fireEvent.change(email, { target: { value: 'test@gmail.com' } });
    expect(email.value).toBe('test@gmail.com');
    const password = screen.getByPlaceholderText('Password');
    fireEvent.change(password, { target: { value: '88888888' } });
    expect(password.value).toBe('88888888');
    const btn = screen.getByText(/Sign up/i);
    fireEvent.click(btn);
  });
});
