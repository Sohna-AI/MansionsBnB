'use strict';
// const Sequelize = require('sequelize');
// let tableName = 'Spots';
// let usersTableName = 'Users';

// if (process.env.NODE_ENV === 'production') {
//   tableName = process.env.SCHEMA ? `${process.env.SCHEMA}.${tableName}` : tableName;
//   usersTableName = process.env.SCHEMA
//     ? `${Sequelize.literal(process.env.SCHEMA)}.${usersTableName}`
//     : usersTableName;
// }
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.fields = 'OwnerId';
options.tableName = 'Spots';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint(
      options,
      {
        type: 'foreign key',
        fields: options.fields,
        name: 'owner_id_constraint',
        references: {
          table: 'Users',
          field: 'id',
        },
        onDelete: 'CASCADE',
      },
      options
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeConstraint(options, 'owner_id_constraint');
  },
};
