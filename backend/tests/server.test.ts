import checkVert from '../game/checkVert';
import checkHoriz from '../game/checkHoriz';

jest.mock('../models');

describe('checkVert test', () => {
  test('fill box', async () => {
    const obj = {
      sticks: [
        [{ byPlayer: 'Steve' }, {}, {}],
        [{}, { byPlayer: 'Steve' }, {}],
        [{ byPlayer: 'Steve' }, {}, {}],
      ],
      boxes: [
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
      ],
      save: jest.fn(),
      changed: () => {},
    };
    const flag = await checkVert(obj, 1, 0, 'Steve');
    expect(flag).toBe(false);
    expect(obj.save).toBeCalled();
    expect(obj.save.mock.instances[0].boxes[0][0].byPlayer).toBe('Steve');
  });

  test('no fill box', async () => {
    const obj = {
      sticks: [
        [{ byPlayer: 'Steve' }, {}, {}],
        [{}, { byPlayer: 'Steve' }, {}],
        [{}, {}, {}],
      ],
      boxes: [
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
      ],
      save: jest.fn(),
      changed: () => {},
    };
    const flag = await checkVert(obj, 1, 0, 'Steve');
    expect(flag).toBe(true);
    expect(obj.save).not.toBeCalled();
  });
});
describe('checkHoriz test', () => {
  test('fill box', async () => {
    const obj = {
      sticks: [
        [{}, {}, {}],
        [{ byPlayer: 'Steve' }, { byPlayer: 'Steve' }, {}],
        [{ byPlayer: 'Steve' }, {}, {}],
      ],
      boxes: [
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
      ],
      save: jest.fn(),
      changed: () => {},
    };
    const flag = await checkHoriz(obj, 0, 0, 'Steve');
    expect(flag).toBe(false);
    expect(obj.save).toBeCalled();
    expect(obj.save.mock.instances[0].boxes[0][0].byPlayer).toBe('Steve');
  });
  test('no fill box', async () => {
    const obj = {
      sticks: [
        [{}, {}, {}],
        [{}, { byPlayer: 'Steve' }, {}],
        [{}, {}, {}],
      ],
      boxes: [
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
      ],
      save: jest.fn(),
      changed: () => {},
    };
    const flag = await checkHoriz(obj, 0, 0, 'Steve');
    expect(flag).toBe(true);
    expect(obj.save).not.toBeCalled();
  });
});
