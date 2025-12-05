'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('CREATE INDEX index_email_for_users ON users (email)')
    await queryInterface.sequelize.query('CREATE INDEX index_referral_for_users ON users (referred_by)')
    await queryInterface.sequelize.query('CREATE INDEX index_code_for_countries ON countries (code)')
    await queryInterface.sequelize.query('CREATE INDEX index_id_and_status_for_users ON users (unique_id, is_active)')
    await queryInterface.sequelize.query('CREATE INDEX index_code_and_status_for_states ON states (code, is_active)')
    await queryInterface.sequelize.query('CREATE INDEX index_type_and_status_for_bonus ON bonus (bonus_type, is_active)')
    await queryInterface.sequelize.query('CREATE INDEX index_id_and_date_for_users_activity ON user_activity (user_id, created_at)')
    await queryInterface.sequelize.query('CREATE INDEX index_id_user_and_date_for_user_bonus ON user_bonus (user_id, bonus_id, claimed_at)')
    // await queryInterface.sequelize.query('CREATE INDEX index_welcome_package ON packages (welcome_package, is_active, valid_from, valid_till)')
    await queryInterface.sequelize.query('CREATE INDEX index_game_id_status_for_games ON casino_games (unique_id, is_active)')
    await queryInterface.sequelize.query('CREATE INDEX index_status_for_providers ON casino_providers (is_active)')
    await queryInterface.sequelize.query('CREATE INDEX index_status_for_aggregators ON casino_aggregators (is_active)')
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex('users', 'index_email_for_users')
    await queryInterface.removeIndex('users', 'index_referral_for_users')
    await queryInterface.removeIndex('countries', 'index_code_for_countries')
    await queryInterface.removeIndex('states', 'index_id_and_status_for_users')
    await queryInterface.removeIndex('bonus', 'index_type_and_status_for_bonus')
    await queryInterface.removeIndex('user_activity', 'index_id_and_date_for_users_activity')
    await queryInterface.removeIndex('user_bonus', 'index_id_user_and_date_for_user_bonus')
    await queryInterface.removeIndex('packages', 'index_welcome_package')
    await queryInterface.removeIndex('casino_games', 'index_game_id_status_for_games')
    await queryInterface.removeIndex('casino_providers', 'index_status_for_providers')
    await queryInterface.removeIndex('casino_aggregators', 'index_status_for_aggregators')
  }
}
