import { RoomTypes } from '../types/RoomTypes';

export default async function checkVert(
  moveRoom: RoomTypes, x: number, y: number, player: string,
) {
  const room = moveRoom;
  const { sticks } = room;
  const { boxes } = room;
  let moveFlag = true;
  if (y !== 0 && !boxes[(x - 1) / 2][y - 1].byPlayer) {
    if (sticks[x][y - 1].byPlayer
      && sticks[x + 1][y - 1].byPlayer
      && sticks[x - 1][y - 1].byPlayer) {
      moveFlag = false;
      boxes[(x - 1) / 2][y - 1].byPlayer = player;
      room.boxes = boxes;
      room.changed('sticks', true);
      await room.save({ fields: ['boxes'] });
    }
  }
  if (y !== sticks[x].length - 1 && !boxes[(x - 1) / 2][y].byPlayer) {
    if (sticks[x][y + 1].byPlayer
      && sticks[x - 1][y].byPlayer
      && sticks[x + 1][y].byPlayer) {
      moveFlag = false;
      boxes[(x - 1) / 2][y].byPlayer = player;
      room.changed('sticks', true);
      room.boxes = boxes;
      await room.save({ fields: ['boxes'] });
    }
  }
  return moveFlag;
}
