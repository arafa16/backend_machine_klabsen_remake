'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('privileges', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING,
      },
      dashboard: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      edit_user_sub: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      absen: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      kalendar_sub: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      pengajuan_koreksi_sub: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      approval_koreksi_sub: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      approval_all_koreksi_sub: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      absen_modal: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      wfh_modal: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      shift_modal: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      absen_check: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      pengajuan_koreksi_sub: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      approval_koreksi_sub: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      approval_all_koreksi_sub: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      absen_modal: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      wfh_modal: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      shift_modal: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      absen_check: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      admin_event: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      perhitungan_absen: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      slip_gaji: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      pendapatan_sub: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      pendapatan_lain_sub: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      pendapatan_admin_sub: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      employees: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      data_employee: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      attribute: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      setting: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
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
    await queryInterface.dropTable('privileges');
  }
};