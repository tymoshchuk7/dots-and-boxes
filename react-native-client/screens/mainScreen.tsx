import React, { useEffect } from 'react';
import { View, Text,
  StyleSheet, FlatList } from 'react-native';
import { connect } from 'react-redux';
import { getStatsAction, logOutAction } from '../actions/userActions';
import { getRoomsAction } from '../actions/roomActions';
import { RoomField } from '../types/RoomTypes';
import { UserStats } from '../types/UserTypes';

interface MainScreenProps {
  allRooms: {
    available: RoomField[],
    active: RoomField[],
  };
  stats: UserStats;
  getStats: () => void;
  getRooms: () => void;
  logOut: () => void;
  navigation: any;
}

const MainScreen: React.FC<MainScreenProps> = 
({ allRooms, stats, getStats, getRooms, navigation }) => {
  const { available, active } = allRooms;

  useEffect(() => {
    getStats();
    getRooms();
  }, []);

  return(
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          Welcome!
        </Text>
        <View style={styles.wrapper}>
          <Text style={styles.text}>
            wins: { stats.wins }
          </Text>
          <Text style={styles.text}>
            defeats: { stats.defeats }
          </Text>
          <Text style={styles.text}>
            draws: { stats.draws }
          </Text>
        </View>
      </View>
      { available.length > 0 && (
        <Text style={styles.title}>
          Available rooms
        </Text>
      )}
      <FlatList
        data={available}
        keyExtractor={(room: any) => room.id}
        style={styles.wrapper}
        renderItem={({ item }: any) => {
          return(
            <Text
              style={styles.text}
              onPress={() => navigation.push('Room', { id: item.id })}
            >
              { item.name }
            </Text>
          )
        }}
      />
      { active.length > 0 && (
        <Text style={styles.title}>
          Active rooms
        </Text>
      )}
      <FlatList
        data={active}
        keyExtractor={(room: any) => room.id}
        style={styles.wrapper}
        renderItem={({ item }: any) => {
          return(
            <Text
              style={styles.text}
              onPress={() => navigation.push('Room', { id: item.id })}
            >
              { item.name }
            </Text>
          )
        }}
      />
    </View>
  )
};

const mapStateToProps = (state: any) => ({
  verifyUser: state.verifyUser,
  allRooms: state.allRooms,
  stats: state.stats,
});

const mapDispatchToProps = {
  getStats: getStatsAction,
  getRooms: getRoomsAction,
  logOut: logOutAction,
};

const wrapper = connect(mapStateToProps, mapDispatchToProps)(MainScreen);

export default wrapper;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    paddingTop: 16,
    textAlign: 'center'
  },
  wrapper: {
    paddingTop: 16,
    paddingLeft: 24,
  },
  text: {
    fontSize: 16,
  }
});