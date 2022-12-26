import { DataTypes } from 'sequelize';
import db from '../db';
import { PlayerInstance } from '../types/PlayerTypes';

export default function definePlayer() {
  const Player = db.define<PlayerInstance>('player', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    playername: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    move: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'user.jpg',
    },
    winner: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    creator: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    underscored: true,
  });
  return Player;
}
