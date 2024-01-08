'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.addColumn('Courses', 'tags', {
      type: Sequelize.DataTypes.ARRAY(Sequelize.DataTypes.STRING)
    })

    await queryInterface.changeColumn('Courses', 'rating', {
      type: Sequelize.DataTypes.DECIMAL
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Courses', 'tags')
    await queryInterface.removeColumn('Courses', 'rating')
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    
  }
};
