import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Avatar, Chip } from 'react-native-paper';
import { connect } from 'react-redux';
import config from '../config';
import { RoomPlayer } from '../types/RoomTypes';

interface PlayerListInterface {
  player: RoomPlayer;
  score: any;
  game: any;
  counter: number;
  getStickColor: (arg1: string, arg2: any) => string | undefined;
}

const PlayerList: React.FC<PlayerListInterface> = ({
  counter, getStickColor, game, score, player
}) => {
  
  return(
    <View style={styles.playerListWrapper}>
    {game.roomPlayers.map((roomPlayer: RoomPlayer) => {
      return (
        <View style={styles.playercard} key={roomPlayer.id}>
          <View style={{ margin: 5 }}>
            <View>
              {roomPlayer?.move && (
                <Chip
                  mode='outlined'
                  style={styles.playerCardLabel}
                  icon="clock-outline"
                >
                  {counter}
                </Chip>
              )}
              <View style={{ alignItems: 'center' }}>
                <Avatar.Image
                  size={70}
                  source={{
                    uri: config.IO_API + roomPlayer.avatar,
                  }}
                />
              </View>
            </View>
            <Text style={styles.playerCardNick}>
              {roomPlayer.playername} {roomPlayer.id === player.id ? ('(me)') : ('')}
            </Text>
            <Text
              style={{
                ...styles.playercardColorBox,
                backgroundColor: getStickColor(roomPlayer.userId, game),
              }}
            >
              {score[roomPlayer.userId]}
            </Text>
          </View>
        </View>
      )
    })}
  </View>
  )
}

const mapStateToProps = (state: any) => ({
  game: state.game,
  score: state.score,
  player: state.player,
});

const wrapper = connect(mapStateToProps)(PlayerList);

export default wrapper;

const styles = StyleSheet.create({
  playerListWrapper: {
    height: '25%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playercard: {
    borderRadius: 5,
    elevation: 5,
    padding: 5,
    shadowColor: '#52006A',
    marginHorizontal: 5,
    position: 'relative',
  },
  playerCardLabel: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 100,
  },
  playerCardNick: {
    textAlign: 'center',
    fontSize: 16,
  },
  playercardColorBox: {
    height: 24,
    color: '#fff',
    textAlign: 'center',
    borderWidth: 2,
    borderRadius: 20,
    borderColor: '#000',
    fontSize: 16,
  },
});