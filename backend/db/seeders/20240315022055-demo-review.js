'use strict';
const { Review } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.validate = true;

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

    const demo_reviews = [
      {
        userId: 2,
        spotId: 1,
        review: 'Spot is amazing!',
        stars: 5,
      },
      {
        userId: 1,
        spotId: 2,
        review: 'Great spot with alot to do',
        stars: 4,
      },
      {
        userId: 2,
        spotId: 3,
        review: 'Loved the idea and how clean it was',
        stars: 3,
      },
      {
        userId: 3,
        spotId: 4,
        review: 'Wonderful experience',
        stars: 4,
      },
      {
        userId: 1,
        spotId: 5,
        review: 'Amazing spot!!!!!',
        stars: 5,
      },
      {
        userId: 2,
        spotId: 1,
        review: 'Will book again! Amazing!',
        stars: 5,
      },
      {
        userId: 3,
        spotId: 2,
        review: 'Family loved the spot, amazing views',
        stars: 4,
      },
      {
        userId: 1,
        spotId: 3,
        review: 'Could be better and could use some cleaning',
        stars: 3,
      },
      {
        userId: 2,
        spotId: 4,
        review: 'Great Spot!',
        stars: 4,
      },
      {
        userId: 3,
        spotId: 5,
        review: 'Really enjoyed the time, amazing for a party venue',
        stars: 5,
      },
    ];

    await Review.bulkCreate(demo_reviews, options);
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
