const { USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES, RESPONSIBLE_GAMBLING_DATA_TYPE_MAPPING } = require('@src/utils/constants/public.constants.utils')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Delete all user_limits except self_exclusion
    await queryInterface.sequelize.query(
      'DELETE FROM user_limits WHERE key != :selfExclusion',
      { replacements: { selfExclusion: USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.SELF_EXCLUSION } }
    )

    // 2. Get all users
    const users = await queryInterface.sequelize.query(
      'SELECT id FROM users',
      { type: Sequelize.QueryTypes.SELECT }
    )

    // 3. Prepare the keys to insert
    const limitKeys = [
      USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.DAILY_BET_LIMIT,
      USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.WEEKLY_BET_LIMIT,
      USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.MONTHLY_BET_LIMIT,
      USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.DAILY_LOSS_LIMIT,
      USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.WEEKLY_LOSS_LIMIT,
      USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.MONTHLY_LOSS_LIMIT,
      USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.DAILY_DEPOSIT_LIMIT,
      USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.WEEKLY_DEPOSIT_LIMIT,
      USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.MONTHLY_DEPOSIT_LIMIT
    ]

    // 4. For each user, insert all limits
    const now = new Date()
    const rows = []
    for (const user of users) {
      for (const key of limitKeys) {
        rows.push({
          user_id: user.id,
          key,
          type: RESPONSIBLE_GAMBLING_DATA_TYPE_MAPPING[key],
          value: '',
          current_value: '',
          expire_at: null,
          created_at: now,
          updated_at: now
        })
      }
    }
    if (rows.length) {
      await queryInterface.bulkInsert('user_limits', rows)
    }
  },

  down: async (queryInterface, Sequelize) => {
    // Optional: Remove all limits except self_exclusion
    await queryInterface.sequelize.query(
      'DELETE FROM user_limits WHERE key != :selfExclusion',
      { replacements: { selfExclusion: USER_RESPONSIBLE_GAMBLING_LIMIT_TYPES.SELF_EXCLUSION } }
    )
  }
}
