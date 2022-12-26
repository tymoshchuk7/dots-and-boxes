import db from '../db';
import checkVert from '../game/checkVert';
import checkHoriz from '../game/checkHoriz';
import solveScore from '../game/solveScore';
import changeMove from '../game/changeMove';
import {
  Room, Player, User,
} from '../models/models';

const RoomId = '012f655c-821e-4f07-ae53-ebbf75ceb45f';
const RoomId2 = '86ab8f5d-816a-4b12-b25a-b737b5e1d0fd';
const UserId = '26011413-ac7e-47b3-a09e-2535c371c11b';
const UserId2 = '4a8c2954-6e1b-4d59-807f-d5c7dfd06485';
const PlayerId = '14a1f758-1a67-44c0-ad84-aa1c6c2c841a';
const PlayerId2 = '14cc618a-4a8a-46d7-9d63-345042db5c4f';

describe('tests with using of db', () => {
  beforeAll(async () => {
    await Room.create({
      id: RoomId,
      name: 'test 123',
      width: 3,
      height: 3,
      status: 'New Room',
      sticks: [
        [{}, { byPlayer: UserId }, {}],
        [{ byPlayer: UserId }, { byPlayer: UserId }, {}],
        [{ byPlayer: UserId }, { byPlayer: UserId }, {}],
      ],
      boxes: [
        [{}, {}, {}],
        [{}, {}, {}],
        [{}, {}, {}],
      ],
    });
    await Room.create({
      id: RoomId2,
      name: 'test 456',
      width: 3,
      height: 3,
      status: 'New Room',
      sticks: [
        [{ byPlayer: UserId }, { byPlayer: UserId }, { byPlayer: UserId }],
        [{ byPlayer: UserId2 }, { byPlayer: UserId2 }, { byPlayer: UserId2 }],
        [{ byPlayer: UserId }, { byPlayer: UserId }, { byPlayer: UserId }],
      ],
      boxes: [
        [{ byPlayer: UserId }, { byPlayer: UserId }, { byPlayer: UserId }],
        [{ byPlayer: UserId }, { byPlayer: UserId }, { byPlayer: UserId }],
        [{ byPlayer: UserId2 }, { byPlayer: UserId2 }, { byPlayer: UserId2 }],
      ],
    });
    await User.create({
      id: UserId,
      email: 'user@gmail.com',
      username: 'username',
      password: '1111',
    });
    await User.create({
      id: UserId2,
      email: 'user2@gmail.com',
      username: 'username2',
      password: '2222',
    });
    await Player.create({
      id: PlayerId,
      userId: UserId,
      roomId: RoomId2,
      playername: 'username',
      move: true,
      creator: true,
      winner: false,
    });
    await Player.create({
      id: PlayerId2,
      userId: UserId2,
      roomId: RoomId2,
      playername: 'username2',
      move: false,
      creator: false,
      winner: false,
    });
  });
  test('fill box after chose of vert stick', async () => {
    const room = await Room.findOne({
      where: {
        id: RoomId,
      },
    });
    await checkVert(room, 1, 2, UserId);
    const checkRoom = await Room.findOne({
      where: {
        id: RoomId,
      },
    });
    const boxes = checkRoom.boxes;
    expect(boxes[0][1].byPlayer).toBe(UserId);
  });
  test('fill box after chose of horiz stick', async () => {
    const room = await Room.findOne({
      where: {
        id: RoomId,
      },
    });
    await checkHoriz(room, 0, 0, UserId2);
    const checkRoom = await Room.findOne({
      where: {
        id: RoomId,
      },
    });
    const boxes = checkRoom.boxes;
    expect(boxes[0][0].byPlayer).toBe(UserId2);
  });
  test('change move test', async () => {
    const spy = jest.spyOn(Player, 'findOne');
    await changeMove(true, {
      ids: [PlayerId, PlayerId2],
      userIds: [UserId, UserId2],
      roomName: 'test room',
      currentId: PlayerId,
    });
    const player = await Player.findOne({
      where: {
        id: PlayerId,
      },
    });
    const player2 = await Player.findOne({
      where: {
        id: PlayerId2,
      },
    });
    expect(player.move).toBe(false);
    expect(player2.move).toBe(true);
    spy.mockRestore();
  });
  test('solve score test', async () => {
    const spy = jest.spyOn(Player, 'findOne');
    const room = await Room.findOne({
      where: {
        id: RoomId2,
      },
      include: ['roomPlayers']
    });
    await solveScore(room);
    const player = await Player.findOne({
      where: {
        id: PlayerId,
      },
    });
    expect(player.winner).toBe(true);
    spy.mockRestore();
  });
  afterAll(async () => {
    await db.close();
  });
});
