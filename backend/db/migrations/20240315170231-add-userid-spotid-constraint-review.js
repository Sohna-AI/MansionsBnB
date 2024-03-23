'use strict';
let options = {};
options.tableName = 'Reviews';

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
    await queryInterface.changeColumn(options, 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.changeColumn(options, 'spotId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Spots',
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
    await queryInterface.changeColumn(options, 'userId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn(options, 'spotId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
