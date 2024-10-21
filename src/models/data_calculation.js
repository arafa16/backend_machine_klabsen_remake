'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class data_calculation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  data_calculation.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    calculation_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    nik: DataTypes.STRING,
    jumlah_hari: DataTypes.INTEGER,
    masuk: DataTypes.INTEGER,
    masuk_normal: DataTypes.INTEGER,
    masuk_pelanggaran: DataTypes.INTEGER,
    pulang: DataTypes.INTEGER,
    pulang_normal: DataTypes.INTEGER,
    pulang_pelanggaran: DataTypes.INTEGER,
    cuti: DataTypes.INTEGER,
    sakit: DataTypes.INTEGER,
    tidak_absen: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    point: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'data_calculation',
    underscored: true,
  });
  return data_calculation;
};