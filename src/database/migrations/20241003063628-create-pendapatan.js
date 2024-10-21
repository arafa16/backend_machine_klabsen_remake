'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pendapatans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      uuid: {
        type: Sequelize.STRING
      },
      tipe_pendapatan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "tipe_pendapatans",
          key: "id",
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
      },
      pendapatan_atas: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      periode: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      initial_periode: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      basic_salary: {
        type: Sequelize.DECIMAL,
        allowNull: true,
      },
      kjk:{
        type: Sequelize.DECIMAL,
        allowNull:true
      },
      tunjangan_jabatan:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      incentive:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      rapel:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      adjustment:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      overtime_allowance:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      tax:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      overtime_fee_1:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      overtime_fee_2:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      tunjangan_jht:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      tunjangan_pensiun:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      tunjangan_jkk:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      tunjangan_jkm:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      tunjangan_bpjs:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      zakat:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      iuran_koperasi:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      angsuran_koperasi:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      pinalti:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      potongan_pinjaman:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      potongan_jht:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      potongan_bpjs:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      potongan_pensiun:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      adjustment_minus:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      potongan_anggota:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      thr:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      shu:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      bonus:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      kompensasi:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      pph21:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      potongan_pph21:{
          type: Sequelize.DECIMAL,
          allowNull:true
      },
      total:{
          type: Sequelize.DECIMAL,
          allowNull:true
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
    await queryInterface.dropTable('pendapatans');
  }
};