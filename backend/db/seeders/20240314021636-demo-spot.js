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
        state: 'New York',
        country: 'United States of America',
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
        state: 'New York',
        country: 'United States of America',
        lat: 40.9451,
        lng: -72.30562,
        name: 'Luxury Modern Farmhouse',
        description:
          'The home offers a 50ft heated gunite pool, hot tub, and sunken all-weather tennis court. The outdoor terrace stretches the entire length of the house with two covered porches, a state-of-the-art outdoor kitchen, firepit and new outdoor furniture ensuring everyone will relax in comfort.',
        price: 1300000.0,
      },
      {
        ownerId: 3,
        address: '44 Aspen Ridge Heights SW',
        city: 'Calgary',
        state: 'Alberta',
        country: 'Canada',
        lat: 51.03953,
        lng: -114.19775,
        name: 'Majestic Estate Aspen Heights',
        description:
          'Opportunity to rent the most distinguished estate in coveted Aspen Heights. This exceptional majestic estate blends modern elegance with architectural grandeur, boasting soaring ceilings and sophisticated interior design. Resting on nearly one acre of lush grounds, it stands as the largest and only gated property in Aspen Heights, promising unparalleled exclusivity, security, and privacy. Spanning over 14,000 sq. ft. of luxurious living space,',
        price: 750000.0,
      },
      {
        ownerId: 2,
        address: 'Highstairs Ln',
        city: 'Derbyshire',
        state: 'England',
        country: 'United Kingdom',
        lat: 53.15096,
        lng: -1.41767,
        name: 'Stretton House',
        description:
          'Stretton House is a Victorian country manor in Derbyshire, just outside the Peak District National Park. It is ideally suited for large family parties, weekends with friends, and corporate use.',
        price: 6000.0,
      },
      {
        ownerId: 1,
        address: 'Chileno Bay',
        city: 'San Jose Del Cabo',
        state: 'Baja California Sur',
        country: 'Mexico',
        lat: 22.90129,
        lng: -109.92091,
        name: 'Villa Cielito del Mar',
        description:
          'Cielito del Mar is an iconic, two-acre estate nestled into the rocks of Chileno Bay Cove. Designed by famed mid-twentieth-century architect Cliff May, it is the last remaining original Chileno Bay home from Baja’s Golden Age. The property boasts its own private beach.',
        price: 18000,
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
