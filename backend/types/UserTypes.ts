import { Optional, Model } from 'sequelize';

export interface UserAttributes {
  id: string;
  avatar?: string;
  username: string;
  email: string;
  password: string;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
  UserAttributes {}
