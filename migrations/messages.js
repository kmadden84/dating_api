'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        type: DataTypes.STRING,
        allowNull: false
      },
      senderId:  {
        type: DataTypes.STRING,
        default: "none",
       // allowNull: false,
      },
      recipientId: {
        type: DataTypes.STRING,
        default: "none",
       // allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Mesages');
  }
};