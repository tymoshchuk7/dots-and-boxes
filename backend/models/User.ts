import { DataTypes } from 'sequelize';
import db from '../db';
import { UserInstance } from '../types/UserTypes';

export default function defineUser() {
  const User = db.define<UserInstance>('user', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    avatar: {
      type: DataTypes.STRING,
      defaultValue: 'user.jpg',
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    underscored: true,
  });
  return User;
}
