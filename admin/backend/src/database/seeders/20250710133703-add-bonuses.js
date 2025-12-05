'use strict'

import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { v4 as uuidv4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */
async function up(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()

  try {
    const now = new Date()
    const validOnDays = parseInt('1111111', 2) // Every day of the week

    const bonusesToSeed = [
      {
        type: BONUS_TYPES.DEPOSIT,
        title: { EN: 'Deposit Bonus' },
        desc: { EN: 'Redeemable on 1st, 2nd, 3rd, and 4th deposits' },
      },
      {
        type: BONUS_TYPES.WELCOME,
        title: { EN: 'Welcome Bonus' },
        desc: { EN: 'Available for new users only' },
      },
      {
        type: BONUS_TYPES.FREESPINS,
        title: { EN: 'Free Spins' },
        desc: { EN: 'Enjoy free spins on selected slots' },
      },
      {
        type: BONUS_TYPES.RAKE_BACK,
        title: { EN: 'Rake Back' },
        desc: { EN: 'Earn back a percentage of your bets' },
      },
      {
        type: BONUS_TYPES.LOYALTY,
        title: { EN: 'Loyalty Bonus' },
        desc: { EN: 'VIP one-off reward' },
      },
      {
        type: BONUS_TYPES.CASH_BACK,
        title: { EN: 'Cash Back' },
        desc: { EN: 'Get a percentage back from losses' },
      },
      {
        type: BONUS_TYPES.PROMO_CODE,
        title: { EN: 'Promo Code Bonus' },
        desc: { EN: 'Unlock rewards using promo codes' },
      },
      {
        type: BONUS_TYPES.BIRTHDAY,
        title: { EN: 'Birthday Bonus' },
        desc: { EN: 'Celebrate your birthday with a bonus' },
      }
    ]

    for (const bonus of bonusesToSeed) {
      const existing = await queryInterface.sequelize.query(
        `SELECT id FROM bonus WHERE bonus_type = :type LIMIT 1`,
        {
          replacements: { type: bonus.type },
          type: Sequelize.QueryTypes.SELECT,
          transaction
        }
      )

      if (!existing?.[0]) {
        const [inserted] = await queryInterface.sequelize.query(
          `INSERT INTO bonus (
            code, bonus_type, valid_on_days, term_and_condition, image_url,
            promotion_title, description, is_active, created_at, updated_at
          ) VALUES (
            :code, :bonusType, :validOnDays, :terms, :imageUrl,
            :title, :desc, :isActive, :createdAt, :updatedAt
          ) RETURNING id`,
          {
            replacements: {
              code: uuidv4(),
              bonusType: bonus.type,
              validOnDays,
              terms: JSON.stringify({ EN: 'Standard terms apply' }),
              imageUrl: null,
              title: JSON.stringify(bonus.title),
              desc: JSON.stringify(bonus.desc),
              isActive: false,
              createdAt: now,
              updatedAt: now
            },
            type: Sequelize.QueryTypes.INSERT,
            transaction
          }
        )

        const bonusId = inserted?.[0]?.id || inserted?.[0]?.[0]?.id

        // Add sample bonus_currencies entry (optional)
        if (bonusId) {
          await queryInterface.sequelize.query(
            `INSERT INTO bonus_currencies (
              bonus_id, currency_id, amount, min_deposit_amount,
              min_bet_amount, max_bonus_claimed, created_at, updated_at
            ) VALUES (
              :bonusId, :currencyId, :amount, :minDeposit,
              :minBet, :maxClaimed, :createdAt, :updatedAt
            )
            ON CONFLICT (bonus_id, currency_id)
            DO NOTHING`,
            {
              replacements: {
                bonusId,
                currencyId: 1,           // default currencyId; change as needed
                amount: 100,
                minDeposit: 20,
                minBet: 5,
                maxClaimed: 500,
                createdAt: now,
                updatedAt: now
              },
              transaction
            }
          )
        }
      }
    }

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

async function down(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()
  try {
    await queryInterface.bulkDelete(
      'bonus',
      {
        bonus_type: {
          [Sequelize.Op.in]: [
            BONUS_TYPES.DEPOSIT,
            BONUS_TYPES.WELCOME,
            BONUS_TYPES.FREE_SPINS,
            BONUS_TYPES.RAKE_BACK,
            BONUS_TYPES.LOYALTY,
            BONUS_TYPES.CASH_BACK,
            BONUS_TYPES.PROMO_CODE,
            BONUS_TYPES.BIRTHDAY
          ]
        }
      },
      { transaction }
    )
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

export { up, down }
