'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class data_email extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      data_email.belongsTo(models.status_email,{
        foreignKey:"status_email_id"
      });
    }
  }
  data_email.init({
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    from: DataTypes.STRING,
    to: DataTypes.STRING,
    subject: DataTypes.STRING,
    text_email: DataTypes.STRING,
    status_email_id: DataTypes.INTEGER,
    code: DataTypes.INTEGER,
    is_active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'data_email',
    underscored: true,
  });
  return data_email;
};