import { DataTypes } from 'sequelize';
import db from '../db';
import { RoomInstance, RoomStatus } from '../types/RoomTypes';

export default function defineRoom() {
  const RoomModel = db.define<RoomInstance>('room', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: DataTypes.ENUM({ values: Object.values(RoomStatus) }),
      allowNull: false,
      defaultValue: RoomStatus.NEW_ROOM,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    sticks: {
      type: DataTypes.JSONB,
    },
    boxes: {
      type: DataTypes.JSONB,
    },
    move_timestamp: {
      type: DataTypes.DATE,
    },
  }, {
    underscored: true,
  });
  return RoomModel;
}
