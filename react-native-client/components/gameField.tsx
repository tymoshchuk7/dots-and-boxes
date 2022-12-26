import React from 'react';
import { 
  ScrollView, TouchableOpacity, Text,
  View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';

interface GameFieldInterface {
  game: any;
  socket: any
};

interface CellInterface {
  type: keyof typeof styles;
  color: string; 
  coords: {
    x: number;
    y: number;
  };
  letter?: string;
};

const choseStick = (payload: { x: number, y: number }, socket: any) => {
  socket?.emit('MOVE', payload);
};

const GameField: React.FC<GameFieldInterface> = ({ game, socket }) => {
  const { sticks } = game;

  return(
    <ScrollView style={{ maxHeight: '60%' }}>
      <ScrollView horizontal={true}>
        <View style={styles.gameBoard}>
          {sticks && sticks.map((row: any, index: number) => (
            <View
              style={styles.flexRow}
              key={game.id + index}
            >
              {row.map((cell: CellInterface, index2: number) => {
                return (
                  <Text
                    style={{
                      ...styles[cell.type],
                      backgroundColor: cell.color,
                    }}
                    onPress={() => choseStick(cell.coords, socket)}
                    key={game.id + index + index2}
                  >
                    {cell.letter && (`${cell.letter.toUpperCase()}`)}
                  </Text>
                )
              })}
            </View>
          ))}
        </View>
      </ScrollView>
   </ScrollView>
  )
}

const mapStateToProps = (state: any) => ({
  game: state.game 
});

const wrapper = connect(mapStateToProps)(GameField);

export default wrapper;

const styles = StyleSheet.create({
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
  vertical: {
    minWidth: 20,
    borderWidth: 2,
    borderColor: 'grey',
    minHeight: 70,
    padding: 0,
    borderRadius: 10,
    marginVertical: 5,
  },
  horizontal: {
    marginHorizontal: 5,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'grey',
    width: 70,
    padding: 0,
  },
  dot: {
    width: 20,
    borderRadius: 20,
    backgroundColor: 'black',
    height: 20,
  },
  box: {
    minHeight: 70,
    minWidth: 70,
    margin: 5,
    marginVertical: 5,
    borderRadius: 35,
    color: '#fff',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 36,
  }
});
