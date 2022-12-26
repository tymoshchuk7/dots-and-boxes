import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter, Route } from 'react-router-dom';
import { render, fireEvent, screen } from '@testing-library/react';
import SocketContext from '../contexts/socketConnection';
import App from '../App';
import { storeCreator } from '../store';

export const renderApp = (initialState = {}) => {
  const store = storeCreator(initialState);
  let testHistory;
  let testLocation;
  const page = render(
    <Provider store={store}>
      <MemoryRouter>
        <SocketContext>
          <App />
          <Route
            path="*"
            render={({ history, location }) => {
              testHistory = history;
              testLocation = location;
              return null;
            }}
          />
        </SocketContext>
      </MemoryRouter>
    </Provider>,
  );
  const currentLocation = () => testLocation.pathname;
  const currentHistroy = () => testHistory;
  return {
    page,
    currentLocation,
    currentHistroy,
  };
};

export const sendChangeEvent = (target, value) => fireEvent.change(target, { target: { value } });
export const clickButtonWithText = (text) => fireEvent.click(screen.getByText(text));
export const buildJsonResponse = (body, status = 200) => ({
  body,
  status,
  headers: {
    'Content-type': 'application/json',
  },
});
