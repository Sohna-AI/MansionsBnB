'use strict';
const { Booking } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.validate = true;
options.tableName = 'Bookings';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const demo_booking = [
      {
        spotId: 1,
        userId: 1,
        startDate: '2024-10-16',
        endDate: '2024-11-16',
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2024-12-16',
        endDate: '2024-12-27',
      },
      {
        spotId: 3,
        userId: 2,
        startDate: '2024-09-10',
        endDate: '2024-11-05',
      },
    ];

    await Booking.bulkCreate(demo_booking, options);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete(options, null, {});
  },
};
