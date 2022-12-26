import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { RoomField, RoomPlayer, Stick } from '../../types/RoomTypes';

interface GameFieldInterface {
  size: string;
  game: RoomField;
  player: RoomPlayer;
  socket: any;
}

const color = ['#ff0000', '#0000e6', '#00cc44', '#ffff00'];
const boxColor = ['#ff4d4d', '#3366ff', '#b3ffcc', '#ffff99'];

function choseStick(x: number, y: number, socket: any) {
  const payload = { x, y };
  socket?.emit('MOVE', payload);
}

const getStickColor = (playerList: RoomPlayer[], stick: Stick) => {
  const somePlayer = playerList.find((colorPlayer) => colorPlayer.userId === stick.byPlayer);
  let playerIndex;
  if (somePlayer) {
    playerIndex = playerList.indexOf(somePlayer);
  }
  return color[playerIndex];
};

let circleCounter = 0;
const getCircle = (game: RoomField, index: number, index2: number, size: { width: number }) => {
  const { boxes, roomPlayers } = game;
  const box = boxes[(index - 1) / 2][index2];
  const somePlayer = roomPlayers.find((colorPlayer) => colorPlayer.userId === box.byPlayer);
  let playerIndex;
  const { width } = size;
  const vwInPx = width / 100;
  let widthInPx = (30 / boxes.length) * vwInPx;
  widthInPx = widthInPx < 60 ? 60 : widthInPx;
  if (somePlayer) {
    playerIndex = roomPlayers.indexOf(somePlayer);
    circleCounter += 1;
    return (
      <svg height={`${widthInPx}px`} width={`${widthInPx}px`}>
        <defs>
          <radialGradient id={`grad-${circleCounter}`} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" style={{ stopColor: 'rgb(0,0,0)' }} />
            <stop offset="100%" style={{ stopColor: `${color[playerIndex]}` }} />
          </radialGradient>
        </defs>
        <circle
          cx="50%"
          cy="50%"
          r={`${widthInPx / 2}px`}
          fill={`url(#grad-${circleCounter})`}
        />
      </svg>
    );
  }
  return null;
};

const getPlayerLetter = (game: RoomField, index: number, index2: number) => {
  const { boxes, roomPlayers } = game;
  const box = boxes[(index - 1) / 2][index2];
  const somePlayer = roomPlayers.find((colorPlayer) => colorPlayer.userId === box.byPlayer);
  return somePlayer?.playername[0];
};

const onHover = (
  event: React.MouseEvent, playerList: RoomPlayer[], stick: Stick, player: RoomPlayer,
) => {
  if (!stick.byPlayer) {
    const target = event.target as HTMLButtonElement;
    const somePlayer = playerList.find((colorPlayer) => colorPlayer.userId === player.userId);
    if (somePlayer) {
      const playerIndex = playerList.indexOf(somePlayer);
      target.style.background = boxColor[playerIndex];
    }
  }
};

const unHover = (event: React.MouseEvent, stick: Stick) => {
  if (!stick.byPlayer) {
    const target = event.target as HTMLButtonElement;
    target.style.background = '';
  }
};

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const GameField: React.FC<GameFieldInterface> = ({
  game, size, player, socket,
}) => {
  const { sticks } = game;
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="field-wrapper">
      <div className="d-flex justify-content-center board">
        <div className="d-flex flex-column gameboard">
          {sticks && sticks.map((row, index) => (
            <div className="d-flex flex-row" key={game.id + index}>
              {row.map((stick, index2) => {
                if (index % 2) {
                  if (index2 === row.length - 1) {
                    return (
                      <div className="vert-wrapper" key={game.id + index + index2}>
                        <button
                          style={{
                            height: size,
                            backgroundColor: getStickColor(game.roomPlayers, stick),
                          }}
                          className="vert"
                          type="button"
                          aria-label="click stick"
                          onClick={() => choseStick(index, index2, socket)}
                          onMouseOver={(event) => onHover(event, game.roomPlayers, stick, player)}
                          onMouseOut={(event) => unHover(event, stick)}
                        />
                      </div>
                    );
                  }
                  return (
                    <div className="d-flex flex-row" key={game.id + index + index2}>
                      <div className="vert-wrapper">
                        <button
                          style={{
                            backgroundColor: getStickColor(game.roomPlayers, stick),
                            height: size,
                          }}
                          className="vert"
                          type="button"
                          aria-label="click stick"
                          onClick={() => choseStick(index, index2, socket)}
                          onMouseOver={(event) => onHover(event, game.roomPlayers, stick, player)}
                          onMouseOut={(event) => unHover(event, stick)}
                        />
                      </div>
                      <div
                        style={{
                          width: size,
                          height: size,
                          backgroundRepeat: 'no-repeat',
                          backgroundPosition: 'center',
                          backgroundSize: '60%',
                        }}
                        className="box d-flex justify-content-center align-items-center"
                      >
                        <p
                          className="m-0 p-0"
                          style={{
                            color: '#fff',
                            fontSize: '36px',
                            position: 'relative',
                          }}
                        >
                          <span
                            className="box__letter"
                            style={{
                              fontSize: 40,
                            }}
                          >
                            {getPlayerLetter(game, index, index2)?.toUpperCase()}
                          </span>
                          {getCircle(game, index, index2, windowDimensions)}
                        </p>
                      </div>
                    </div>
                  );
                }
                return (
                  <div className="horiz-wrapper" key={game.id + index + index2}>
                    <button
                      style={{
                        backgroundColor: getStickColor(game.roomPlayers, stick),
                        width: size,
                      }}
                      className={`horiz${index2 === game.sticks[index].length - 1 ? ('-last') : ('')}`}
                      type="button"
                      aria-label="click stick"
                      onClick={() => choseStick(index, index2, socket)}
                      onMouseOver={(event) => { onHover(event, game.roomPlayers, stick, player); }}
                      onMouseOut={(event) => unHover(event, stick)}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: any) => ({
  game: state.game,
  player: state.player,
});

const wrapper = connect(mapStateToProps)(GameField);

export default wrapper;
