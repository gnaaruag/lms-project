'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Module.belongsTo(models.Chapter, {
        foreignKey: 'chapterId'
      })

      Module.hasMany(models.Page, {
        foreignKey: 'moduleId'
      })
    }
  }
  Module.init({
    moduleNo: DataTypes.INTEGER,
    title: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Module',
  });
  return Module;
};