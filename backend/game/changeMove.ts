import { Player } from '../models/models';
import { sendMoveInfo } from '../notifications';

interface Payload {
  ids: Array<string>;
  userIds: Array<string>;
  currentId: string;
  roomName: string;
}

export default async function changeMove(moveResult: boolean, payload: Payload) {
  if (moveResult) {
    const {
      ids, currentId, roomName, userIds,
    } = payload;
    const player1 = await Player.findOne({
      where: {
        id: currentId,
      },
    });
    player1.move = false;
    await player1.save({ fields: ['move'] });
    const nextIndex = (ids.indexOf(currentId) + 1);
    const nextPlayer = ids[
      nextIndex % ids.length
    ];
    const player2 = await Player.findOne({
      where: {
        id: nextPlayer,
      },
    });
    player2.move = true;
    await player2.save({ fields: ['move'] });
    sendMoveInfo({
      userIds,
      roomName,
      currentMoveId: player2.userId,
      roomId: player2.roomId,
    });
  }
}
