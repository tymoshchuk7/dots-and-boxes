import { RoomTypes } from '../types/RoomTypes';

export default async function checkHoriz(
  moveRoom: RoomTypes, x: number, y: number, player: string,
) {
  const room = moveRoom;
  const { sticks } = room;
  const { boxes } = room;
  let moveFlag = true;
  if (x !== 0 && !boxes[(x - 2) / 2][y].byPlayer) {
    if (sticks[x - 2][y].byPlayer
      && sticks[x - 1][y].byPlayer
      && sticks[x - 1][y + 1].byPlayer) {
      moveFlag = false;
      boxes[(x - 2) / 2][y].byPlayer = player;
      room.changed('sticks', true);
      room.boxes = boxes;
      await room.save({ fields: ['boxes'] });
    }
  }
  if (x !== sticks.length - 1 && !boxes[x / 2][y].byPlayer) {
    if (sticks[x + 2][y].byPlayer
      && sticks[x + 1][y].byPlayer
      && sticks[x + 1][y + 1].byPlayer) {
      moveFlag = false;
      boxes[x / 2][y].byPlayer = player;
      room.changed('sticks', true);
      room.boxes = boxes;
      await room.save({ fields: ['boxes'] });
    }
  }
  return moveFlag;
}
