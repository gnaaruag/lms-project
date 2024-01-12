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
    await queryInterface.addColumn("Pages", "moduleId", {
      type: Sequelize.DataTypes.INTEGER,
    });

    await queryInterface.addConstraint("Pages", {
      fields: ["moduleId"],
      type: "foreign key",
      references: {
        table: "Modules",
        field: "id",
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("Pages", "moduleId");
  }
};
