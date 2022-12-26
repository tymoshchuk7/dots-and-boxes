import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { io, Socket } from 'socket.io-client';
import { connect } from 'react-redux'
import AsyncStorage from '@react-native-async-storage/async-storage';
import GameField from '../components/gameField'
import PlayerList from '../components/playerList';
import { RoomPlayer } from '../types/RoomTypes';
import { UserVerify } from '../types/UserTypes';
import config from '../config';
import { setGameAction, setPlayerAction, setScoreAcion } from '../actions/roomActions';

interface RoomScreenInterface {
  navigation: any,
  route: any;
  game: {
    id: string;
    status: string;
    sticks: any;
    boxes: any;
    roomPlayers: RoomPlayer[];
  };
  user: UserVerify;
  score: any;
  player: RoomPlayer;
  setGame: (arg: object) => void;
  setScore: (arg: object) => void;
  setPlayer: (arg: object) => void;
};

const getToken = async () => {
  const token = await AsyncStorage.getItem('token');
  return token;
}

const token = getToken();

const getStickColor = (playerId: string, game: any) => {
  const color = ['#ff0000', '#0000e6', '#00cc44', '#ffff00'];
  const movePlayer = game.roomPlayers.find((pl: RoomPlayer) => pl.userId === playerId);
  let playerIndex;
  if (movePlayer) {
    playerIndex = game.roomPlayers.indexOf(movePlayer);
    return color[playerIndex];
  }
};

const getPlayersAttr = (box: any, players: any) => {
  const somePlayer = players.find((colorPlayer: RoomPlayer) => colorPlayer.userId === box);
  return somePlayer?.playername[0];
};

const RoomScreen: React.FC<RoomScreenInterface> = ({
  navigation, route, user, game, player, setGame, setPlayer, setScore,
}) => {
  const { id } = route.params;
  const [socket, setSocket] = useState<Socket>();
  const [counter, setCounter] = useState(0);

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

  useFocusEffect(
    useCallback(() => {
      token.then((token) => {
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
            navigation.push('Main');
          }
        });
        socketInit.on('UPDATE_FIELD', (gameState) => {
          const { field, points } = gameState;
          const newField = field.sticks.map((row: any, index: number) => {
            return row.map((stick: any, index2: number) => {
              const isVertical = index % 2;
              if (isVertical) {
                return {
                  type: 'vertical',
                  color: getStickColor(stick.byPlayer, field),
                  coords: { x: index, y: index2 }
                }
              }
              return {
                type: 'horizontal',
                color: getStickColor(stick.byPlayer, field),
                coords: { x: index, y: index2 }
              }
            });
          });
          newField.forEach((row: any, index: number) => {
            const isVertical = index % 2;
            let a = 0;
            let b = 0;
            return row.forEach((stick: any, index2: number) => {
              if (isVertical) {
                if (row.length === (index2 * 2) + 1) return;
                row.splice(index2 + 1 + b, 0, {
                  type: 'box',
                  color: getStickColor(field.boxes[(index - 1) / 2][index2].byPlayer, field),
                  letter: getPlayersAttr(field.boxes[(index - 1) / 2][index2].byPlayer, field.roomPlayers),
                });
                b += 1;
              } else {
                row.splice(index2 + a, 0, { type: 'dot', color: 'black' });
                a += 1;
                if (row.length === (index2 * 2) + 2)
                  row.splice(row.length, 0, { type: 'dot', color: 'black' })
              }
            });
          });

          field.sticks = newField
          const { roomPlayers } = field;
          const currentPlayer = roomPlayers?.find((pl: RoomPlayer) => pl.userId === user.id);
          if (id === field.id) {
            setPlayer(currentPlayer);
            setGame(field);
            if (points) setScore(points);
          }
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
      });
      return () => {
        setGame({ roomPlayers: [] });
        socket?.disconnect();
      }
    }, [])
  );

  return (
    <View style={styles.container}>
      <PlayerList counter={counter} getStickColor={getStickColor} />
      {game.status === 'New Room' && (
        <View style={styles.pregameWrapper}>
          <Text style={styles.preGameTitle}>
            Waiting for opponents...
          </Text>
          {player.move && (
            <Button
              onPress={() => socket?.emit('START')}
              mode='contained'
              disabled={game.roomPlayers.length < 2}
              style={{ marginTop: 15 }}
            >
              Start!
            </Button>)}
        </View>)}
      {game.status === 'Active' && <GameField socket={socket} />}
      {game.status === 'Finished' && (
        <Text style={styles.result}>
          {player?.winner ? ('Win') : ('Defeat')}
        </Text>
      )}
      {game.status === 'Draw' && (
        <Text style={styles.result}>
          Draw
        </Text>
      )}
    </View>
  )
};

const mapStateToProps = (state: any) => ({
  game: state.game,
  user: state.verifyUser,
  player: state.player,
});

const mapDispatchToProps = {
  setGame: setGameAction,
  setPlayer: setPlayerAction,
  setScore: setScoreAcion,
};

const wrapper = connect(mapStateToProps, mapDispatchToProps)(RoomScreen);

export default wrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  pregameWrapper: {
    paddingTop: 20,
  },
  preGameTitle: {
    fontSize: 24,
  },
  gameBoard: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  result: {
    fontSize: 24,
    textAlign: 'center',
  },
});