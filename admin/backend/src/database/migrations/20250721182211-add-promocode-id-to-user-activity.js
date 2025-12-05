'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn(
      'user_activity',
      'promocode_id',
      {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: null,
        field: 'promocode_id'
      }
    )
  },

  down: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('user_activity', 'promocode_id')
  }
}
