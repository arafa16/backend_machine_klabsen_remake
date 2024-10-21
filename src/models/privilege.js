'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class privilege extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  privilege.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    dashboard: DataTypes.BOOLEAN,
    edit_user_sub: DataTypes.BOOLEAN,
    absen: DataTypes.BOOLEAN,
    kalendar_sub: DataTypes.BOOLEAN,
    pengajuan_koreksi_sub: DataTypes.BOOLEAN,
    approval_koreksi_sub: DataTypes.BOOLEAN,
    approval_all_koreksi_sub: DataTypes.BOOLEAN,
    absen_modal: DataTypes.BOOLEAN,
    wfh_modal: DataTypes.BOOLEAN,
    shift_modal: DataTypes.BOOLEAN,
    absen_check: DataTypes.BOOLEAN,
    admin_event: DataTypes.BOOLEAN,
    perhitungan_absen: DataTypes.BOOLEAN,
    slip_gaji: DataTypes.BOOLEAN,
    pendapatan_sub: DataTypes.BOOLEAN,
    pendapatan_lain_sub: DataTypes.BOOLEAN,
    pendapatan_admin_sub: DataTypes.BOOLEAN,
    employees: DataTypes.BOOLEAN,
    data_employee: DataTypes.BOOLEAN,
    attribute: DataTypes.BOOLEAN,
    setting: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'privilege',
    underscored: true,
  });
  return privilege;
};