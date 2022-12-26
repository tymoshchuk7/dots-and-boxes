'use strict';

const RoomStatus = {
  NEW_ROOM: 'New Room',
  ACTIVE: 'Active',
  DRAW: 'Draw',
  FINISHED: 'Finished',
  DELETED: 'Deleted',
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('rooms', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      name: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: Sequelize.DataTypes.ENUM(Object.values(RoomStatus)),
        allowNull: false,
        defaultValue: RoomStatus.NEW_ROOM,
      },
      width: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      height: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
      },
      sticks: {
        type: Sequelize.DataTypes.JSONB,
      },
      boxes: {
        type: Sequelize.DataTypes.JSONB,
      },
      move_timestamp: {
        type: Sequelize.DataTypes.DATE,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        field: 'updated_at'
      },
    }, {
      underscored: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('users');
  }
};
