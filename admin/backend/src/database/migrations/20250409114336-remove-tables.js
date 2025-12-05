'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    const tables = [
      'document_labels',
      'documents',
      'email_templates',
      'wagering_templates',
      'wagering_template_game_details',
      'loyalty_levels',
      'main_threads',
      'thread_messages',
      'thread_attachements'
    ]

    for (const table of tables) {
      try {
        await queryInterface.sequelize.query(`DROP TABLE IF EXISTS "${table}" CASCADE;`)
      } catch (err) {
        console.warn(`Failed to drop table ${table}: ${err.message}`)
      }
    }

    await queryInterface.sequelize.query('ALTER TABLE bonus DROP COLUMN IF EXISTS wagering_template_id;')
  },

  async down (queryInterface, DataTypes) {
  }
}
