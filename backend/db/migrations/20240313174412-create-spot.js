'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.tableName = 'Spots';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'Spots',
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        ownerId: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        city: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        state: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        country: {
          type: Sequelize.STRING(30),
          allowNull: false,
        },
        lat: {
          type: Sequelize.DECIMAL(9, 7),
          allowNull: false,
        },
        lng: {
          type: Sequelize.DECIMAL(10, 7),
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING(500),
          allowNull: false,
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      },
      options
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable(options);
  },
};
