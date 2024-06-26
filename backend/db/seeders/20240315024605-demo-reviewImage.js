'use strict';
const { ReviewImage } = require('../models');
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.validate = true;
options.tableName = 'ReviewImages';
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
    const demo_reviewImage = [
      {
        url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=3271&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        reviewId: 1,
      },
      {
        url: 'https://images.unsplash.com/photo-1664742872826-b8c4947d2b03?q=80&w=3267&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        reviewId: 2,
      },
      {
        url: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        reviewId: 3,
      },
    ];
    await ReviewImage.bulkCreate(demo_reviewImage, options);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    options.truncate = true;
    options.cascade = true;
    options.restartIdentity = true;
    await queryInterface.bulkDelete(options, null, {});
  },
};
