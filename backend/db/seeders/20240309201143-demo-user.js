'use strict';
const { User } = require('../models');
const bcrypt = require('bcryptjs');
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
    const demo_user = [
      {
        username: 'demoUser1',
        email: 'demo@gmail.com',
        hashedPassword: bcrypt.hashSync('password'),
      },
      {
        username: 'demoUser2',
        email: 'demo2@yahoo.com',
        hashedPassword: bcrypt.hashSync('password2'),
      },
      {
        username: 'demoUser3',
        email: 'demo3@user.com',
        hashedPassword: bcrypt.hashSync('password3'),
      },
    ];

    await User.bulkCreate(demo_user, { validate: true });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Users', null, {});
  },
};
