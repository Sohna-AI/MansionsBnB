'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.validate = true;
options.tableName = 'SpotImages';
const { SpotImage } = require('../models');
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
    const demo_spotImage = [
      {
        url: 'https://ik.imagekit.io/edge/tr:w-1200,ar-545-303,pr-true/properties/5803/photos/DSC_1129_30_31_32_33September_19-Edit.jpg',
        spotId: 1,
        preview: true,
      },
      {
        url: 'https://ik.imagekit.io/edge/tr:w-1200,ar-545-303,pr-true/properties/5803/photos/DSC_1104_5_6_7_8September_19.jpg',
        spotId: 1,
        preview: false,
      },
      {
        url: 'https://ik.imagekit.io/edge/tr:w-1200,ar-545-303,pr-true/properties/5803/photos/DSC_1109_10_11_12_13September_19.jpg',
        spotId: 1,
        preview: false,
      },
      {
        url: 'https://ik.imagekit.io/edge/tr:w-1200,ar-545-303,pr-true/properties/5803/photos/DSC_1084_5_6_7_8September_19.jpg',
        spotId: 1,
        preview: false,
      },
      {
        url: 'https://ik.imagekit.io/edge/tr:w-1200,ar-545-303,pr-true/properties/5803/photos/sgsg.PNG',
        spotId: 1,
        preview: false,
      },
      {
        url: 'https://ik.imagekit.io/edge/tr:w-1200,ar-545-303,pr-true/properties/5764/photos/Zabriskie_House.jpg',
        spotId: 2,
        preview: true,
      },
      {
        url: 'https://ik.imagekit.io/edge/tr:w-1200,ar-545-303,pr-true/properties/5764/photos/Zabriskie_House_Dining_Room_Doorway.jpg',
        spotId: 2,
        preview: false,
      },
      {
        url: 'https://ik.imagekit.io/edge/tr:w-1200,ar-545-303,pr-true/properties/5764/photos/Zabriskie_House_Firepit.jpg',
        spotId: 2,
        preview: false,
      },
      {
        url: 'https://ik.imagekit.io/edge/tr:w-1200,ar-545-303,pr-true/properties/5764/photos/Zabriskie_House_Staircase.jpg',
        spotId: 2,
        preview: false,
      },
      {
        url: 'https://ik.imagekit.io/edge/tr:w-1200,ar-545-303,pr-true/properties/5764/photos/Zabriskie_House_Reception.jpg',
        spotId: 2,
        preview: false,
      },
      {
        url: 'https://images.rentals.ca/property-pictures/medium/calgary-ab/559224/apartment-23657076.jpg',
        spotId: 3,
        preview: true,
      },
      {
        url: 'https://images.rentals.ca/property-pictures/medium/calgary-ab/559224/apartment-23657078.jpg',
        spotId: 3,
        preview: false,
      },
      {
        url: 'https://images.rentals.ca/property-pictures/medium/calgary-ab/559224/apartment-23657081.jpg',
        spotId: 3,
        preview: false,
      },
      {
        url: 'https://images.rentals.ca/property-pictures/medium/calgary-ab/559224/apartment-23657083.jpg',
        spotId: 3,
        preview: false,
      },
      {
        url: 'https://images.rentals.ca/property-pictures/medium/calgary-ab/559224/apartment-23657087.jpg',
        spotId: 3,
        preview: false,
      },
      {
        url: 'https://i.plumcache.com/listings/f5066380-6796-4384-8306-50fe12ca3aef/5a1c284b-a375-420d-a2fd-01f0223f1a13..jpg?w=1080&fit=min&fm=avif',
        spotId: 4,
        preview: true,
      },
      {
        url: 'https://i.plumcache.com/listings/f5066380-6796-4384-8306-50fe12ca3aef/02bef6bd-d210-4343-9d2e-8eee7959d2a5..jpg?w=1080&fit=min&fm=avif',
        spotId: 4,
        preview: false,
      },
      {
        url: 'https://i.plumcache.com/listings/f5066380-6796-4384-8306-50fe12ca3aef/519b8e4f-5c28-4d01-b5e9-702db1c76da1..jpg?w=1080&fit=min&fm=avif',
        spotId: 4,
        preview: false,
      },
      {
        url: 'https://i.plumcache.com/listings/f5066380-6796-4384-8306-50fe12ca3aef/013a13b5-0f82-478d-81d5-e6038a368f5b..jpg?w=1080&fit=min&fm=avif',
        spotId: 4,
        preview: false,
      },
      {
        url: 'https://i.plumcache.com/listings/f5066380-6796-4384-8306-50fe12ca3aef/adcc7076-2658-4485-a420-b392702a2c6b..jpg?w=1080&fit=min&fm=avif',
        spotId: 4,
        preview: false,
      },
      {
        url: 'https://villas.journeymexico.com/wp/wp-content/uploads/casa-bellamar-villa-front.jpg',
        spotId: 5,
        preview: true,
      },
      {
        url: 'https://villas.journeymexico.com/wp/wp-content/uploads/casa-bellamar-villa-pool.jpg',
        spotId: 5,
        preview: false,
      },
      {
        url: 'https://villas.journeymexico.com/wp/wp-content/uploads/casa-bellamar-villa-entrance.jpg',
        spotId: 5,
        preview: false,
      },
      {
        url: 'https://villas.journeymexico.com/wp/wp-content/uploads/casa-bellamar-view.jpg',
        spotId: 5,
        preview: false,
      },
    ];
    await SpotImage.bulkCreate(demo_spotImage, options);
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
