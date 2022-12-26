'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('players', {
      id: {
        type: Sequelize.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.DataTypes.UUIDV4,
      },
      avatar: {
        type: Sequelize.DataTypes.STRING,
        defaultValue: 'user.jpg',
      },
      playername: {
        type: Sequelize.DataTypes.STRING,
        allowNull: false,
      },
      move: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      winner: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      creator: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
      },
      user_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'users',
          },
          key: 'id'
        },
        allowNull: false
      },
      room_id: {
        type: Sequelize.DataTypes.UUID,
        references: {
          model: {
            tableName: 'rooms',
          },
          key: 'id'
        },
        allowNull: false
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
    queryInterface.dropTable('players');
  }
};
