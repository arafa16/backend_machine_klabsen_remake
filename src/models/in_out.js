'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class in_out extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      in_out.belongsTo(models.tipe_absen,{
        foreignKey:"tipe_absen_id"
      });
      in_out.belongsTo(models.pelanggaran,{
        foreignKey:"pelanggaran_id"
      });
      in_out.belongsTo(models.status_inout,{
        foreignKey:"status_inout_id"
      });
      in_out.belongsTo(models.user,{
        foreignKey:"user_id"
      });
      in_out.belongsTo(models.jam_operasional,{
        foreignKey:"jam_operasional_id"
      });
    }
  }
  in_out.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: DataTypes.BIGINT,
    tanggal_mulai: DataTypes.DATE,
    tanggal_selesai: DataTypes.DATE,
    tipe_absen_id: DataTypes.INTEGER,
    pelanggaran_id: DataTypes.INTEGER,
    status_inout_id: DataTypes.INTEGER,
    jam_operasional_id: DataTypes.INTEGER,
    is_absen_web: DataTypes.BOOLEAN,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'in_out',
    underscored: true,
  });
  return in_out;
};