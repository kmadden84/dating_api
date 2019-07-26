'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      first_name: {
        type: Sequelize.STRING
      },
      last_name: {
        type: Sequelize.STRING
      },
      fav_movie: {
        type: Sequelize.STRING
      },
      fav_band: {
        type: Sequelize.STRING
      },
      fav_song: {
        type: Sequelize.STRING
      },
      looking_for: {
        type: Sequelize.STRING
      },
      drinking: {
        type: Sequelize.STRING
      },
      education: {
        type: Sequelize.STRING
      },
      build: {
        type: Sequelize.STRING
      },
      living_status: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      ideal_vaca: {
        type: Sequelize.STRING
      },
      fav_cheese: {
        type: Sequelize.STRING
      },
      fav_timeofday: {
        type: Sequelize.STRING
      },
      fav_mov_genre: {
        type: Sequelize.STRING
      },
      fav_weather: {
        type: Sequelize.STRING
      },
      fav_drink: {
        type: Sequelize.STRING
      },
      fav_cuisine: {
        type: Sequelize.STRING
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
   // return queryInterface.dropTable('Users');
  }
};