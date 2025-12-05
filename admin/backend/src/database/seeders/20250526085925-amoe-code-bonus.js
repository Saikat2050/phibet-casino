'use strict'

import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'
import { v4 as uuidv4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */

async function up (queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()

  try {
    // 1. Check for a bonus with bonus_type 'postal_code'
    const [postalBonus] = await queryInterface.sequelize.query(
      `SELECT id FROM bonus WHERE bonus_type = :postalCode LIMIT 1`,
      {
        replacements: { postalCode: BONUS_TYPES.POSTAL_CODE },
        type: Sequelize.QueryTypes.SELECT,
        transaction
      }
    )
    console.log('postalBonus', postalBonus);
    
    let bonusId
    if (postalBonus && postalBonus.id) {
      // 2. If found, update it to 'amoe_code' and update all fields
      await queryInterface.sequelize.query(
        `UPDATE bonus SET
          bonus_type = :amoeCode,
          valid_on_days = :validOnDays,
          image_url = :imageUrl,
          term_and_condition = :terms,
          promotion_title = :title,
          description = :desc,
          tag_ids = :tagIds,
          is_active = :isActive,
          updated_at = :updatedAt
        WHERE id = :bonusId`,
        {
          replacements: {
            amoeCode: BONUS_TYPES.AMOE_CODE,
            validOnDays: parseInt('1111111', 2),
            imageUrl: 'https://example.com/bonus-image.jpg',
            terms: JSON.stringify({ EN: 'Standard terms and conditions apply.' }),
            title: JSON.stringify({ EN: 'Special AMOE Bonus', ES: 'Bono especial AMOE' }),
            desc: JSON.stringify({ EN: 'Enter without deposit via AMOE', ES: 'Entrar sin depósito a través de AMOE' }),
            tagIds: null,
            isActive: true,
            updatedAt: new Date(),
            bonusId: postalBonus.id
          },
          transaction
        },
      )
      bonusId = postalBonus.id
    } else {
      // 3. If not found, insert a new 'amoe_code' bonus
      const [insertedBonus] = await queryInterface.sequelize.query(
        `INSERT INTO bonus (
          code, bonus_type, valid_on_days, image_url, term_and_condition,
          promotion_title, description, tag_ids, is_active, created_at, updated_at
        ) VALUES (
          :code, :amoeCode, :validOnDays, :imageUrl, :terms, :title, :desc, :tagIds, :isActive, :createdAt, :updatedAt
        ) RETURNING id`,
        {
          replacements: {
            code: uuidv4(),
            amoeCode: BONUS_TYPES.AMOE_CODE,
            validOnDays: parseInt('1111111', 2),
            imageUrl: 'https://example.com/bonus-image.jpg',
            terms: JSON.stringify({ EN: 'Standard terms and conditions apply.' }),
            title: JSON.stringify({ EN: 'Special AMOE Bonus', ES: 'Bono especial AMOE' }),
            desc: JSON.stringify({ EN: 'Enter without deposit via AMOE', ES: 'Entrar sin depósito a través de AMOE' }),
            tagIds: null,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          type: Sequelize.QueryTypes.INSERT,
          transaction
        }
      )
      // insertedBonus is an array, id is in insertedBonus[0].id or insertedBonus[0][0].id
      bonusId = insertedBonus && insertedBonus[0] && insertedBonus[0].id
      if (!bonusId && insertedBonus && insertedBonus[0] && insertedBonus[0][0]) {
        bonusId = insertedBonus[0][0].id
      }
    }

    // 4. Upsert the bonus_currencies entry for this bonus
    if (bonusId) {
      await queryInterface.sequelize.query(
        `INSERT INTO bonus_currencies (
          bonus_id, currency_id, amount, min_deposit_amount, min_bet_amount, max_bonus_claimed, created_at, updated_at
        ) VALUES (
          :bonusId, :currencyId, :amount, :minDeposit, :minBet, :maxClaimed, :createdAt, :updatedAt
        )
        ON CONFLICT (bonus_id, currency_id)
        DO UPDATE SET
          amount = EXCLUDED.amount,
          min_deposit_amount = EXCLUDED.min_deposit_amount,
          min_bet_amount = EXCLUDED.min_bet_amount,
          max_bonus_claimed = EXCLUDED.max_bonus_claimed,
          updated_at = EXCLUDED.updated_at`,
        {
          replacements: {
            bonusId,
            currencyId: 2,
            amount: 50.0,
            minDeposit: 10.0,
            minBet: 5.0,
            maxClaimed: 100.0,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          transaction
        }
      )
    }

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
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