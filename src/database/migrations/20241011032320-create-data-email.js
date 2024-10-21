'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('data_emails', {
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
      from: {
        type: Sequelize.STRING,
        allowNull:true
      },
      to: {
        type: Sequelize.STRING,
        allowNull:true
      },
      subject: {
        type: Sequelize.STRING,
        allowNull:true
      },
      text_email: {
        type: Sequelize.STRING,
        allowNull:true
      },
      status_email_id: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('data_emails');
  }
};