'use strict';
let tableName = 'Spots';

if (process.env.NODE_ENV === 'production') {
  tableName = process.env.SCHEMA ? `${process.env.SCHEMA}.${tableName}` : tableName;
}
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addConstraint(tableName, {
      type: 'foreign key',
      fields: ['ownerId'],
      name: 'owner_id_constraint',
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
    await queryInterface.removeConstraint(tableName, 'owner_id_constraint');
  },
};
