'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('koreksis', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      in_out_id: {
        type: Sequelize.BIGINT,
        allowNull: true,
        references: {
          model: "in_outs",
          key: "id",
        },
      },
      keterangan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      status_koreksi_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "status_koreksis",
          key: "id",
        },
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
    await queryInterface.dropTable('koreksis');
  }
};