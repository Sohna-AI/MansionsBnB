'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}
options.fields = ['OwnerId'];
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
