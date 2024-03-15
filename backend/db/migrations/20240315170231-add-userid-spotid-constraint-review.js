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
    await queryInterface.addConstraint('Reviews', {
      type: 'foreign key',
      fields: ['userId'],
      name: 'user_id_review_constraint',
      references: {
        table: 'Users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('Reviews', {
      type: 'foreign key',
      fields: ['spotId'],
      name: 'spot_id_review_constraint',
      references: {
        table: 'Spots',
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
    await queryInterface.removeConstraint('Reviews', 'user_id_review_constraint');
    await queryInterface.removeConstraint('Reviews', 'spot_id_review_constraint');
  },
};
