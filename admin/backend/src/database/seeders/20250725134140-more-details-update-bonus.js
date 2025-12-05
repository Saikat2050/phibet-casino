'use strict'

const { DEPOSIT_BONUS_PARTS } = require("@src/utils/constants/public.constants.utils")


module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      const depositBonusDetails = {
        maxDeposits: 4,
        deposits: [
          {
            name: DEPOSIT_BONUS_PARTS.FIRST,
            isPercentage: true,
            amount: 10,
            minimumDeposit: null
          },
          {
            name: DEPOSIT_BONUS_PARTS.SECOND,
            isPercentage: false,
            amount: 50,
            minimumDeposit: 20
          },
          {
            name: DEPOSIT_BONUS_PARTS.THIRD,
            isPercentage: true,
            amount: 15,
            minimumDeposit: 10
          },
          {
            name: DEPOSIT_BONUS_PARTS.FOURTH,
            isPercentage: false,
            amount: 100,
            minimumDeposit: 50
          }
        ]
      }

      await queryInterface.sequelize.query(
        `
        UPDATE "bonus"
        SET "more_details" = :moreDetails,
            "updated_at" = NOW()
        WHERE "bonus_type" = 'deposit_bonus'
        `,
        {
          replacements: { moreDetails: JSON.stringify(depositBonusDetails) },
          type: Sequelize.QueryTypes.UPDATE,
          transaction
        }
      )

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.sequelize.query(
        `
        UPDATE "bonus"
        SET "more_details" = '{}',
            "updated_at" = NOW()
        WHERE "bonus_type" = 'deposit_bonus'
        `,
        {
          type: Sequelize.QueryTypes.UPDATE,
          transaction
        }
      )

      await transaction.commit()
    } catch (error) {
      await transaction.rollback()
      throw error
    }
  }
}
