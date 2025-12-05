'use strict'

const { LEDGER_PURPOSE } = require("@src/utils/constants/public.constants.utils")


module.exports = {
  async up (queryInterface, Sequelize) {
    // Get the enum type name used by Sequelize
    // Sequelize names it like: enum_<table>_<column>
    const enumName = 'enum_ledgers_purpose'

    for (const purpose of Object.values(LEDGER_PURPOSE)) {
      await queryInterface.sequelize.query(
        `ALTER TYPE "${enumName}" ADD VALUE IF NOT EXISTS '${purpose}'`
      )
    }
  },

  async down (queryInterface, Sequelize) {
    // Postgres doesn't support removing enum values directly
    // To rollback, you'd need to recreate the enum without the new values
  }
}
