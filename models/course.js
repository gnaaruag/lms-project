'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.User, {
        foreignKey: 'userId'
      })

      Course.hasMany(models.Chapter, {
        foreignKey: 'courseId'
      })
    }
  }
  Course.init({
    courseName: DataTypes.STRING,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    enrollmentDeadline: DataTypes.DATEONLY,
    description: DataTypes.TEXT,
    prerequisites: DataTypes.ARRAY(DataTypes.STRING),
    tags: DataTypes.ARRAY(DataTypes.STRING)
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};