import React from 'react';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import CreatePage from '../views/createRoomPage';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);
global.fetch = jest.fn();

describe('create page test', () => {
  test('create room action should be called on button click', () => {
    const testStore = mockStore({});
    render(
      <Provider store={testStore}>
        <BrowserRouter>
          <CreatePage />
        </BrowserRouter>
      </Provider>,
    );
    const name = screen.getByPlaceholderText('Some name');
    fireEvent.change(name, { target: { value: 'Big play!' } });
    expect(name.value).toBe('Big play!');
    const width = screen.getByLabelText('Input width of the field between 2 and 30');
    fireEvent.change(width, { target: { value: '4' } });
    expect(width.value).toBe('4');
    const height = screen.getByLabelText('Input height of the field between 2 and 30');
    fireEvent.change(height, { target: { value: '5' } });
    expect(height.value).toBe('5');
    const btn = screen.getByText(/Save/i);
    fireEvent.click(btn);
  });
});
