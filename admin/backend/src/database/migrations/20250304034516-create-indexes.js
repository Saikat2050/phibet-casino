'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE INDEX idx_user_tags_userId ON user_tags (user_id)')
    await queryInterface.sequelize.query('CREATE INDEX idx_user_tags_tagId ON user_tags (tag_id)')
    await queryInterface.sequelize.query('CREATE INDEX idx_tags_tagId_tag ON tags (id, tag)')
    await queryInterface.sequelize.query('CREATE INDEX idx_transaction_currency_ledger ON ledgers (currency_id, transaction_type)')
    await queryInterface.sequelize.query('CREATE INDEX idx_purpose_currency_ledger ON ledgers (currency_id, purpose)')
    await queryInterface.sequelize.query('CREATE INDEX idx_transaction_id_ledger ON ledgers (transaction_id)')
    await queryInterface.removeIndex('ledgers', 'idx_ledgers_purpose')
  },

  down: async (queryInterface, Sequelize) => {
  }
}
