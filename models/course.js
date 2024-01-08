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
    }
  }
  Course.init({
    courseName: DataTypes.STRING,
    courseInstructor: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    prerequisites: DataTypes.ARRAY(DataTypes.STRING),
    rating: DataTypes.FLOAT,
    enrollmentDeadline: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};