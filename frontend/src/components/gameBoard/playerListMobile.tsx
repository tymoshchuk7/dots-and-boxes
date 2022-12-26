import React from 'react';
import { connect } from 'react-redux';
import { RoomField, RoomPlayer, RoomStatus } from '../../types/RoomTypes';
import config from '../../config';

interface PlayerListMobileInterface {
  game: RoomField;
  score: any;
  player: RoomPlayer;
  showPlayerColor: (arg1: RoomPlayer[], arg2: string) => string;
}

const PlayerListMobile: React.FC<PlayerListMobileInterface> = ({
  game, score, player, showPlayerColor,
}) => (
  <div className="players-mobile">
    {game.roomPlayers.map((roomPlayer) => (
      <div
        className={`d-flex playercad-border--mobile align-items-center justify-content-around p-1 ${roomPlayer.move && game.status === RoomStatus.ACTIVE ? ('move') : ('')}`}
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/bar.jpg)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '100% 100%',
        }}
        key={roomPlayer.id}
      >
        <img src={config.IO_API + roomPlayer.avatar} alt="userPhoto" />
        <div>
          {roomPlayer.playername}
            &nbsp;
          {player.id === roomPlayer.id ? ('(me)') : ('')}
        </div>
        <div>
          {score[roomPlayer.userId]}
          &nbsp;
          points
        </div>
        <div style={{
          backgroundColor: showPlayerColor(game.roomPlayers, roomPlayer.userId),
          height: '15px',
          width: '15px',
          border: '1px solid black',
        }}
        />
      </div>
    ))}
  </div>
);

const mapStateToProps = (state: any) => ({
  game: state.game,
  player: state.player,
  score: state.score,
});

const wrapper = connect(mapStateToProps)(PlayerListMobile);

export default wrapper;
