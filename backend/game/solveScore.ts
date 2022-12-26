import _ from 'lodash';
import { RoomStatus, RoomInstance } from '../types/RoomTypes';
import { Player } from '../models/models';
import { PlayerAttributes } from '../types/PlayerTypes';

export default async function solveScore(moveRoom: RoomInstance) {
  const room = moveRoom;
  const { boxes } = room;
  const ids = moveRoom.roomPlayers.map((player: PlayerAttributes) => player.userId);
  let endFlag = true;
  const players = [];
  for (let i = 0; i < boxes.length; i += 1) {
    for (let j = 0; j < boxes[i].length; j += 1) {
      if (!boxes[i][j].byPlayer) {
        endFlag = false;
      } else {
        players.push(boxes[i][j].byPlayer);
      }
    }
  }
  const score = _.countBy(players);
  for (let i = 0; i < ids.length; i += 1) {
    if (!score[ids[i]]) {
      score[ids[i]] = 0;
    }
  }
  if (endFlag) {
    let drawflag = true;
    const drawCheck = Object.values(score);
    for (let i = 0; i < drawCheck.length; i += 1) {
      if (i === drawCheck.length - 1) {
        if (drawCheck[i] !== drawCheck[0]) {
          drawflag = false;
        }
        break;
      }
      if (drawCheck[i] !== drawCheck[i + 1]) {
        drawflag = false;
      }
    }
    if (drawCheck.length === 1) {
      drawflag = false;
    }
    if (drawflag) {
      await room.save({ fields: ['status'] });
    } else {
      let winnerId: string;
      let winnerScore: number = 0;
      _.forIn(score, (value, key) => {
        if (value > winnerScore) {
          winnerScore = value;
          winnerId = key;
        }
      });
      const player = await Player.findOne({
        where: {
          userId: winnerId,
          roomId: room.id,
        },
      });
      player.winner = true;
      await player.save({ fields: ['winner'] });
      room.status = RoomStatus.FINISHED;
      await room.save({ fields: ['status'] });
    }
  }
  return score;
}
