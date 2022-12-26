import { io, Socket } from 'socket.io-client';
import { Button } from 'react-bootstrap';
import { useParams, useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import GameField from '../components/gameBoard/gameField';
import PlayerListMobile from '../components/gameBoard/playerListMobile';
import PlayerList from '../components/gameBoard/playerList';
import config from '../config';
import { setGameAction, setScoreAcion, setPlayerAction } from '../actions/roomActions';
import { RoomField, RoomPlayer, RoomStatus } from '../types/RoomTypes';
import { UserVerify } from '../types/UserTypes';

interface RoomProps {
  game: RoomField;
  user: UserVerify;
  score: any;
  player: RoomPlayer;
  setGame: (arg: object) => void;
  setScore: (arg: object) => void;
  setPlayer: (arg: object) => void;
}

const Room: React.FC<RoomProps> = ({
  game, user, player, setGame, setScore, setPlayer,
}) => {
  const { id } = useParams<{ id?: string }>();
  const token = JSON.parse(localStorage.getItem('token') || '{}');
  const [socket, setSocket] = useState<Socket>();
  const [canClick, setCanClick] = useState(true);
  const history = useHistory();
  const color = ['#ff0000', '#0000e6', '#00cc44', '#ffff00'];
  const [counter, setCounter] = useState(0);
  const { boxes } = game;

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => {
        if (prev <= 0) {
          return prev;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const socketInit = io(`${config.IO_API}rooms`, {
      auth: {
        room: id,
        token,
      },
      transports: ['websocket'],
    });
    socketInit.on('disconnect', (reason) => {
      socketInit.disconnect();
      if (reason === 'io server disconnect') {
        history.push('/main');
      }
    });
    socketInit.on('UPDATE_FIELD', (gameState) => {
      const { field, points } = gameState;
      setGame(field);
      if (points) {
        setScore(points);
      }
      const { roomPlayers } = field;
      const currentPlayer = roomPlayers?.find((pl: RoomPlayer) => pl.userId === user.id);
      setPlayer(currentPlayer);
    });
    socketInit.on('TIME_LEFT', (sec) => {
      const { date, endDate, exitDate } = sec;
      let countdown: number;
      if (exitDate) {
        countdown = (Date.parse(exitDate) - Date.parse(date)) / 1000;
      } else {
        countdown = (endDate - Date.parse(date)) / 1000;
      }
      countdown = Math.round(Number(countdown));
      if (countdown < 0) return;
      setCounter(countdown);
    });
    setSocket(socketInit);
    return () => {
      socketInit.disconnect();
    };
  }, [id]);

  useEffect(() => {
    if (game.roomPlayers?.length > 1) {
      setCanClick(false);
    }
  }, [game.roomPlayers?.length]);

  const showPlayerColor = (playerList: RoomPlayer[], playerId: string) => {
    const movePlayer = playerList.find((pl) => pl.userId === playerId);
    let playerIndex;
    if (movePlayer) {
      playerIndex = playerList.indexOf(movePlayer);
    }
    return color[playerIndex];
  };

  const size = `${30 / (boxes?.length)}vw`;
  return (
    <div className="room">
      <div className="d-flex justify-content-center pt-4">
        <PlayerList showPlayerColor={showPlayerColor} isEven={0} />
        <div className="d-flex flex-column">
          <PlayerListMobile showPlayerColor={showPlayerColor} />
          <GameField socket={socket} size={size} />
          { game.status === RoomStatus.NEW_ROOM ? (
            <div className="text-center p-3">
              <h3>Waiting for the players</h3>
              <p>
                Current number of the players:
                {game.roomPlayers.length}
              </p>
              {player.creator && (
              <Button disabled={canClick} onClick={() => socket?.emit('START')}>Start!</Button>
              )}
            </div>
          ) : ('')}
          { game.status === RoomStatus.ACTIVE ? (
            <div className="info text-center p-2">
              Time left:
              {' '}
              { counter }
            </div>
          ) : ('') }
          { game.status === RoomStatus.FINISHED ? (
            <h3 className="text-center p-2">{player.winner ? ('Win') : ('Defeat')}</h3>
          ) : ('') }
          { game.status === RoomStatus.DRAW ? (
            <h3 className="text-center p-2">Draw</h3>
          ) : ('') }
        </div>
        <PlayerList showPlayerColor={showPlayerColor} isEven={1} />
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  game: state.game,
  user: state.verifyUser,
  score: state.score,
  player: state.player,
});

const mapDispatchToProps = {
  setGame: setGameAction,
  setScore: setScoreAcion,
  setPlayer: setPlayerAction,
};

const wrapper = connect(mapStateToProps, mapDispatchToProps)(Room);

export default wrapper;
