'use strict'

const allBonusTypes = [
  'joining',
  'postal_code',
  'amoe_code',
  'referral_bonus',
  'daily_bonus',
  'freespins',
  'deposit_bonus',
  'bet',
  'welcome_bonus',
  'loyalty_bonus',
  'rake_back',
  'vip_bonus',
  'cash_back',
  'promo_code_bonus',
  'birthday_bonus'
]

module.exports = {
  up: async (queryInterface, Sequelize) => {
    for (const value of allBonusTypes) {
      await queryInterface.sequelize.query(
        `DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_type t
            JOIN pg_enum e ON t.oid = e.enumtypid
            WHERE t.typname = 'enum_bonus_bonus_type'
              AND e.enumlabel = '${value}'
          ) THEN
            ALTER TYPE enum_bonus_bonus_type ADD VALUE '${value}';
          END IF;
        END
        $$;`
      )
    }
  },

  down: async () => {
    // PostgreSQL does not support removing enum values
    // So we leave this blank
  }
}
