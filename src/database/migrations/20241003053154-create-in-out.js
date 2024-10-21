'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('in_outs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      uuid: {
        type: Sequelize.STRING
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      tanggal_mulai: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      tanggal_selesai: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      tipe_absen_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tipe_absens",
          key: "id",
        },
      },
      pelanggaran_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "pelanggarans",
          key: "id",
        },
      },
      status_inout_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "status_inouts",
          key: "id",
        },
      },
      jam_operasional_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "jam_operasionals",
          key: "id",
        },
      },
      is_absen_web: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('in_outs');
  }
};