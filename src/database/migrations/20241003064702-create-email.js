'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('emails', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING,
        allowNull:true
      },
      host: {
        type: Sequelize.STRING,
        allowNull:true
      },
      port: {
        type: Sequelize.STRING,
        allowNull:true
      },
      secure: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      user: {
        type: Sequelize.STRING,
        allowNull:true
      },
      password: {
        type: Sequelize.STRING,
        allowNull:true
      },
      code: {
        type: Sequelize.INTEGER,
        allowNull:true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('emails');
  }
};