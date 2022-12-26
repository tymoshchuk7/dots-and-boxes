import { Optional, Model } from 'sequelize';

export interface PlayerAttributes {
  id: string;
  playername: string;
  move?: boolean;
  avatar?: string;
  winner?: boolean;
  creator?: boolean;
  roomId?: string;
  userId?: string;
}

export interface PlayerCreationAttributes extends Optional<PlayerAttributes, 'id'> {}

export interface PlayerInstance
  extends Model<PlayerAttributes, PlayerCreationAttributes>,
  PlayerAttributes {}
