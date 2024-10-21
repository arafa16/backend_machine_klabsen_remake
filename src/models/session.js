'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class session extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  session.init({
    sid: DataTypes.STRING,
    expires: DataTypes.DATE,
    data: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'session',
    underscored: true,
  });
  return session;
};