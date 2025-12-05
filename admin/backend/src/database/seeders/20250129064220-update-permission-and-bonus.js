'use strict'
import { v4 as uuidv4 } from 'uuid'
import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { APPLICATION_PERMISSION } from '@src/utils/constants/permission.constant'

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  await queryInterface.sequelize.query(`
    UPDATE permissions p
    SET permission = '${JSON.stringify(APPLICATION_PERMISSION)}'
    FROM admin_users au
    WHERE au.admin_role_id = '1';`
  )

  await queryInterface.sequelize.query('ALTER TYPE "enum_bonus_bonus_type" ADD VALUE IF NOT EXISTS \'referral_bonus\'')

  const transaction = await queryInterface.sequelize.transaction()

  try {
    // do not insert the joining bonus if already exists
    const existingDailyBonus = await queryInterface.rawSelect(
      'bonus',
      {
        where: { bonus_type: BONUS_TYPES.REFFERAL },
        attributes: ['id'], // Only check for the existence of the ID
        transaction
      },
      ['id'] // Limit the result to just the ID
    )
    // If a Joining Bonus exists, skip the seeder
    if (existingDailyBonus) {
      await transaction.rollback()
      return
    }

    // Seed Bonus data and return the inserted record
    const [bonus] = await queryInterface.bulkInsert('bonus', [{
      code: uuidv4(),
      bonus_type: BONUS_TYPES.REFFERAL, // Assuming POSTAL_CODE is defined in BONUS_TYPES
      valid_on_days: parseInt('1111111', 2), // All 7 days active
      image_url: 'https://example.com/bonus-image.jpg',
      term_and_condition: JSON.stringify({ EN: 'Standard terms and conditions apply.' }),
      promotion_title: JSON.stringify({ EN: 'Refferal Bonus', ES: 'Bono refferal Joining' }),
      description: JSON.stringify({ EN: 'Invite Friends, Earn Rewards on Their First Deposit!', ES: 'Laden Sie Freunde ein und verdienen Sie Prämien bei ihrer ersten Einzahlung!' }),
      tag_ids: null, // Example tag IDs
      is_active: true,
      created_at: new Date(),
      updated_at: new Date()
    }], { returning: true, transaction })
    // Ensure that the returned value contains the ID properly
    const bonusId = bonus.id

    // Seed BonusCurrency data for the AMOE bonus
    await queryInterface.bulkInsert('bonus_currencies', [{
      bonus_id: bonusId, // Use the correct bonus ID
      currency_id: 2,
      amount: 50.0,
      min_deposit_amount: 0.0,
      min_bet_amount: 0.0,
      max_bonus_claimed: 100.0,
      created_at: new Date(),
      updated_at: new Date()
    }], { transaction })

    // Seed BonusCurrency data for the AMOE bonus
    await queryInterface.bulkInsert('bonus_currencies', [{
      bonus_id: bonusId, // Use the correct bonus ID
      currency_id: 1,
      amount: 50.0,
      min_deposit_amount: 0,
      min_bet_amount: 0,
      max_bonus_claimed: 0,
      created_at: new Date(),
      updated_at: new Date()
    }], { transaction })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
  }
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
}

export { down, up }
