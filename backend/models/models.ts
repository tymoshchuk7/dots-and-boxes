import playerModel from './Player';
import userModel from './User';
import roomModel from './Room';

const Player = playerModel();
const User = userModel();
const Room = roomModel();

User.hasMany(Player, { as: 'players', foreignKey: 'userId' });
Player.belongsTo(User);
Room.hasMany(Player, { as: 'roomPlayers', foreignKey: 'roomId' });
Player.belongsTo(Room);

export {
  Player, User, Room,
};
