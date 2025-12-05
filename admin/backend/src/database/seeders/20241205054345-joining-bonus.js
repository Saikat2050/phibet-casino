'use strict'

import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { v4 as uuidv4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */

async function up (queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()

  try {
    // do not insert the joining bonus if already exists
    const existingJoiningBonus = await queryInterface.rawSelect(
      'bonus',
      {
        where: {
          bonus_type: BONUS_TYPES.JOINING
        },
        attributes: ['id'], // Only check for the existence of the ID
        transaction
      },
      ['id'] // Limit the result to just the ID
    )
    // If a Joining Bonus exists, skip the seeder
    if (existingJoiningBonus) {
      await transaction.rollback()
      return
    }

    // Seed Bonus data and return the inserted record
    const [bonus] = await queryInterface.bulkInsert('bonus', [{
      code: uuidv4(),
      bonus_type: BONUS_TYPES.JOINING, // Assuming POSTAL_CODE is defined in BONUS_TYPES
      valid_on_days: parseInt('1111111', 2), // All 7 days active
      image_url: 'https://example.com/bonus-image.jpg',
      term_and_condition: JSON.stringify({ EN: 'Standard terms and conditions apply.' }),
      promotion_title: JSON.stringify({ EN: 'Special Joining Bonus', ES: 'Bono especial Joining' }),
      description: JSON.stringify({ EN: 'Enter without deposit via Joining', ES: 'Entrar sin depósito a través de Joining' }),
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
      min_deposit_amount: 10.0,
      min_bet_amount: 5.0,
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

async function down (queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()
  try {
    // Rollback Bonus and BonusCurrency seeder
    // await queryInterface.bulkDelete('bonus_currencies', null, { transaction });
    // await queryInterface.bulkDelete('bonus', null, { transaction });

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export { down, up }
