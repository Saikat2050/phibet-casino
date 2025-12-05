'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.removeColumn('users', 'ssn')
  },

  async down (queryInterface, DataTypes) {}
}
