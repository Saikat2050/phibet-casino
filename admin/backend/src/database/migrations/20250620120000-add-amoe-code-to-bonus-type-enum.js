'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(
      "ALTER TYPE enum_bonus_bonus_type ADD VALUE IF NOT EXISTS 'amoe_code';"
    );
  },
  down: async (queryInterface, Sequelize) => {
    // No down migration for removing enum values in Postgres
  }
}; 