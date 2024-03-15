'use strict';
const { Spot } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.validate = true;
options.tableName = 'Spots';
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
    const demo_spots = [
      {
        ownerId: 1,
        address: '157 W 57TH ST, 39F',
        city: 'New York',
        state: 'NY',
        country: 'United States',
        lat: 40.7805,
        lng: -73.97949,
        name: 'One57',
        description:
          'This 3 bedroom corner unit features a gracious, windowed entry foyer that leads to a large living/dining room with a top-of-the-line kitchen. The unit has floor-to-ceiling windows throughout that showcase Central Park views to the North and landmark building views to the South & East.',
        price: 35000.0,
      },
      {
        ownerId: 2,
        address: '290 Lumber Lane',
        city: 'Bridgehampton',
        state: 'NY',
        country: 'United States',
        lat: 40.9451,
        lng: -72.30562,
        name: 'Luxury Modern Farmhouse',
        description:
          'The home offers a 50ft heated gunite pool, hot tub, and sunken all-weather tennis court. The outdoor terrace stretches the entire length of the house with two covered porches, a state-of-the-art outdoor kitchen, firepit and new outdoor furniture ensuring everyone will relax in comfort.',
        price: 1300000.0,
      },
      {
        ownerId: 3,
        address: '505 First Neck Lane',
        city: 'Southampton',
        state: 'NY',
        country: 'United States',
        lat: 40.87,
        lng: -72.39888,
        name: 'First Neck Lane Estate',
        description:
          'This classic shingle style residence on 1.8 +/- acres in Southampton Village is only the shortest distance from the world class Southampton beaches. Ideal for a full summer rental, this completely renovated residence across three levels includes nine bedrooms.',
        price: 750000.0,
      },
    ];

    await Spot.bulkCreate(demo_spots, options);
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
