'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('periode_kerjas', {
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
        allowNull: true,
      },
      bulan: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      tahun: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      tanggal_mulai: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      tanggal_selesai: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      jumlah_hari: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      code: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable('periode_kerjas');
  }
};