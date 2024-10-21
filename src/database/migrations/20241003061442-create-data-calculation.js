'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('data_calculations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING
      },
      calculation_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "calculations",
          key: "id",
        },
      },
      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nik: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      jumlah_hari: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      masuk: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      masuk_normal: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      masuk_pelanggaran: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pulang: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pulang_normal: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      pulang_pelanggaran: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      cuti: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      sakit: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      tidak_absen: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      total: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      point: {
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
    await queryInterface.dropTable('data_calculations');
  }
};