'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class jam_operasional extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  jam_operasional.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    jam_operasional_group_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    jam_masuk: DataTypes.TIME,
    jam_pulang: DataTypes.TIME,
    keterangan: DataTypes.STRING,
    code: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'jam_operasional',
    underscored: true,
  });
  return jam_operasional;
};