'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */


    await queryInterface.addColumn("statuses", "pageId", {
      type: Sequelize.DataTypes.INTEGER,
    });



    await queryInterface.addConstraint("statuses", {
      fields: ["pageId"],
      type: "foreign key",
      references: {
        table: "Pages",
        field: "id",
      },
    });

  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn("statuses", "userId")
  }
};
