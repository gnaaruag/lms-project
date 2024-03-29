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
    await queryInterface.addColumn("Modules", "chapterId", {
      type: Sequelize.DataTypes.INTEGER,
    });

    await queryInterface.addConstraint("Modules", {
      fields: ["chapterId"],
      type: "foreign key",
      references: {
        table: "Chapters",
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
    await queryInterface.removeColumn("Modules", "chapterId");
  }
};
