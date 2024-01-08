'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Courses', 'tags', {
      type: Sequelize.ARRAY(Sequelize.STRING),
    });
  },

  async down(queryInterface, Sequelize) {
    // If you need to revert the changes, add the necessary logic here.
    // For example, you might want to set the type back to STRING.
    await queryInterface.changeColumn('Courses', 'tags', {
      type: Sequelize.STRING,
    });
  },
};
