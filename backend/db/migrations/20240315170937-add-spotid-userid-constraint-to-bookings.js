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
    await queryInterface.addConstraint('Bookings', {
      type: 'foreign key',
      fields: ['spotId'],
      name: 'spot_id_bookings_constraint',
      references: {
        table: 'Spots',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    await queryInterface.addConstraint('Bookings', {
      type: 'foreign key',
      fields: ['userId'],
      name: 'user_id_bookings_constraint',
      references: {
        table: 'Users',
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
    await queryInterface.removeConstraint('Bookings', 'spot_id_bookings_constraint');
    await queryInterface.removeConstraint('Bookings', 'user_id_bookings_constraint');
  },
};
