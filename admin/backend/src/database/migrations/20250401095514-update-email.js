'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE users ADD CONSTRAINT unique_email UNIQUE (email);')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('ALTER TABLE users DROP CONSTRAINT unique_email;')
  }
}
