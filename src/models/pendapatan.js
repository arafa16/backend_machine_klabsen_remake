'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class pendapatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      pendapatan.belongsTo(models.tipe_pendapatan,{
        foreignKey:"tipe_pendapatan_id"
      });
      pendapatan.belongsTo(models.user,{
        foreignKey:"user_id"
      });
      
    }
  }
  pendapatan.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    tipe_pendapatan_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    pendapatan_atas: DataTypes.STRING,
    periode: DataTypes.DATE,
    initial_periode: DataTypes.STRING,
    basic_salary: DataTypes.DECIMAL,
    kjk: DataTypes.DECIMAL,
    tunjangan_jabatan: DataTypes.DECIMAL,
    incentive: DataTypes.DECIMAL,
    rapel: DataTypes.DECIMAL,
    adjustment: DataTypes.DECIMAL,
    overtime_allowance: DataTypes.DECIMAL,
    tax: DataTypes.DECIMAL,
    overtime_fee_1: DataTypes.DECIMAL,
    overtime_fee_2: DataTypes.DECIMAL,
    tunjangan_jht: DataTypes.DECIMAL,
    tunjangan_pensiun: DataTypes.DECIMAL,
    tunjangan_jkk: DataTypes.DECIMAL,
    tunjangan_jkm: DataTypes.DECIMAL,
    tunjangan_bpjs: DataTypes.DECIMAL,
    zakat: DataTypes.DECIMAL,
    iuran_koperasi: DataTypes.DECIMAL,
    angsuran_koperasi: DataTypes.DECIMAL,
    pinalti: DataTypes.DECIMAL,
    potongan_pinjaman: DataTypes.DECIMAL,
    potongan_jht: DataTypes.DECIMAL,
    potongan_bpjs: DataTypes.DECIMAL,
    potongan_pensiun: DataTypes.DECIMAL,
    adjustment_minus: DataTypes.DECIMAL,
    potongan_anggota: DataTypes.DECIMAL,
    thr: DataTypes.DECIMAL,
    shu: DataTypes.DECIMAL,
    bonus: DataTypes.DECIMAL,
    kompensasi: DataTypes.DECIMAL,
    pph21: DataTypes.DECIMAL,
    potongan_pph21: DataTypes.DECIMAL,
    total: DataTypes.DECIMAL,
  }, {
    sequelize,
    modelName: 'pendapatan',
    underscored: true,
  });
  return pendapatan;
};