import React from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import { RoomField, RoomPlayer, RoomStatus } from '../../types/RoomTypes';
import config from '../../config';

interface PlayerListInterface {
  game: RoomField;
  score: any;
  player: RoomPlayer;
  showPlayerColor: (arg1: RoomPlayer[], arg2: string) => string;
  isEven: number;
}

const PlayerList: React.FC<PlayerListInterface> = ({
  game, score, player, showPlayerColor, isEven,
}) => (
  <div className="d-flex flex-column">
    {game.roomPlayers.map((roomPlayer, index) => {
      if (index % 2 === isEven) {
        return (
          <div
            className={`playercard-wrapper ${roomPlayer.move && game.status === RoomStatus.ACTIVE ? ('move') : ('')}`}
            key={roomPlayer.id}
          >
            <div className="playercard">
              <div
                className="text-center playercard__header"
                style={{
                  background: `radial-gradient(black,${showPlayerColor(game.roomPlayers, roomPlayer.userId)})`,
                  color: '#ffffff',
                }}
              >
                {score[roomPlayer.userId]}
                &nbsp;
                points
              </div>
              <div className="playercard-border playercard-name pl-3">
                {roomPlayer.playername}
                  &nbsp;
                {player.id === roomPlayer.id ? ('(me)') : ('')}
              </div>
              <div className="d-flex">
                <div className="playercard-border">
                  <img src={config.IO_API + roomPlayer.avatar} alt="userPhoto" />
                </div>
                <div className="playercard-border">
                  <Button variant="secondary" size="sm">Action</Button>
                </div>
              </div>
            </div>
          </div>
        );
      }
      return null;
    })}
  </div>
);

const mapStateToProps = (state: any) => ({
  game: state.game,
  player: state.player,
  score: state.score,
});

const wrapper = connect(mapStateToProps)(PlayerList);

export default wrapper;
