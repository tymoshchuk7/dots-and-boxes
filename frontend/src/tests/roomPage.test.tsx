import React from 'react';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import Room from '../views/roomPage';

describe('Room page tests', () => {
  const middlewares = [thunk];
  let testStore;
  let component;
  const mockStore = configureStore(middlewares);
  beforeEach(() => {
    testStore = mockStore({
      verifyUser: {
        id: '123',
      },
      score: {
        123: '1',
        456: '2',
        789: '3',
      },
      game: {
        playerList: ['123', '456'],
        sticks: [
          [{}, {}],
          [{}, {}, {}],
          [{}, {}],
          [{}, {}, {}],
          [{}, {}],
        ],
        boxes: [
          [{ byPlayer: null }, { byPlayer: '123' }],
          [{ byPlayer: '123' }, { byPlayer: '456' }],
        ],
        status: 'Active',
        roomPlayers: [{ id: '123' }, { id: '456' }, { id: '789' }],
      },
      player: {
        id: '123',
      },
    });
    component = renderer.create(
      <Provider store={testStore}>
        <BrowserRouter>
          <Room />
        </BrowserRouter>
      </Provider>,
    );
  });

  test('snapshoting the render of component', () => {
    expect(component.toJSON()).toMatchSnapshot();
  });
  test('check call of function on stick chose', () => {
    renderer.act(() => {
      const horizontalSticks = component.root.findAllByProps({ className: 'horiz' });
      const verticalSticks = component.root.findAllByProps({ className: 'vert' });
      expect(horizontalSticks).toHaveLength(3);
      expect(verticalSticks).toHaveLength(6);
    });
  });
});
