import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getStatsAction } from '../actions/userActions';
import { getRoomsAction } from '../actions/roomActions';
import { RoomField } from '../types/RoomTypes';
import { UserStats } from '../types/UserTypes';

interface MainProps {
  allRooms: {
    available: RoomField[],
    active: RoomField[],
  };
  stats: UserStats;
  getStats: () => void;
  getRooms: () => void;
}

const Main: React.FC<MainProps> = ({
  allRooms, getRooms, getStats, stats,
}) => {
  const { available, active } = allRooms;
  useEffect(() => {
    getRooms();
    getStats();
  }, []);

  return (
    <>
      <Container>
        <h1 className="text-center p-3">Welcome!</h1>
        <div>
          <h3>Your stats</h3>
          <ul>
            <li>
              {stats.wins}
              &nbsp;
              wins
            </li>
            <li>
              {stats.defeats}
              &nbsp;
              defeats
            </li>
            <li>
              {stats.draws}
              &nbsp;
              draws
            </li>
          </ul>
        </div>
        <h3>Available rooms</h3>
        <ul>
          { available && available.map((room: RoomField) => (
            <li key={room.id}>
              <Link to={`/room/${room.id}`}>{room.name}</Link>
              {' '}
              (
              {room.width}
              {' '}
              x
              {' '}
              {room.height}
              )
            </li>
          ))}
        </ul>
        <h3>Active rooms</h3>
        <ul>
          { active && active.map((room: RoomField) => (
            <li key={room.id}>
              <Link to={`/room/${room.id}`}>{room.name}</Link>
              {' '}
              (
              {room.width}
              {' '}
              x
              {' '}
              {room.height}
              )
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
};

const mapStateToProps = (state: any) => ({
  allRooms: state.allRooms,
  stats: state.stats,
});

const mapDispatchToProps = {
  getRooms: getRoomsAction,
  getStats: getStatsAction,
};

const wrapper = connect(mapStateToProps, mapDispatchToProps)(Main);

export default wrapper;
