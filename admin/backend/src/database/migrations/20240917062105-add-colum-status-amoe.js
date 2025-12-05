'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('amoentries', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('amoentries', 'status')
  }
}
