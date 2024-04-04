'use strict';
let options = {};
options.tableName = 'ReviewImages';

if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.changeColumn(options, 'reviewId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Reviews',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.changeColumn(options, 'reviewId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
