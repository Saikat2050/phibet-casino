'use strict'

import { v4 as uuidv4 } from 'uuid'

/** @type {import('sequelize-cli').Migration} */

async function up (queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()

  try {
    // Step 1: Get bonus IDs for those bonus types
    const bonuses = await queryInterface.sequelize.query(
      'SELECT id FROM bonus WHERE bonus_type IN (:types)',
      {
        replacements: { types: ['amoe_code', 'joining', 'daily_bonus'] },
        type: Sequelize.QueryTypes.SELECT,
        transaction
      }
    )

    const bonusIds = bonuses.map(b => b.id)

    // Step 2: Delete user_bonus entries for these bonus IDs
    if (bonusIds.length > 0) {
      await queryInterface.bulkDelete(
        'user_bonus',
        { bonus_id: { [Sequelize.Op.in]: bonusIds } },
        { transaction }
      )
    }

    // Step 3: Delete the bonus entries
    await queryInterface.bulkDelete(
      'bonus',
      { bonus_type: { [Sequelize.Op.in]: ['amoe_code', 'joining', 'daily_bonus'] } },
      { transaction }
    )

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

async function down (queryInterface, Sequelize) {
  const now = new Date()
  const validOnDays = parseInt('1111111', 2)

  await queryInterface.bulkInsert('bonus', [
    {
      code: uuidv4(),
      bonus_type: 'amoe_code',
      valid_on_days: validOnDays,
      term_and_condition: JSON.stringify({ EN: 'Standard terms apply' }),
      image_url: null,
      promotion_title: JSON.stringify({ EN: 'AMOE Code Bonus' }),
      description: JSON.stringify({ EN: 'Bonus for Alternate Method of Entry' }),
      is_active: false,
      created_at: now,
      updated_at: now
    },
    {
      code: uuidv4(),
      bonus_type: 'joining',
      valid_on_days: validOnDays,
      term_and_condition: JSON.stringify({ EN: 'Standard terms apply' }),
      image_url: null,
      promotion_title: JSON.stringify({ EN: 'Joining Bonus' }),
      description: JSON.stringify({ EN: 'Bonus for new signups' }),
      is_active: false,
      created_at: now,
      updated_at: now
    },
    {
      code: uuidv4(),
      bonus_type: 'daily_bonus',
      valid_on_days: validOnDays,
      term_and_condition: JSON.stringify({ EN: 'Standard terms apply' }),
      image_url: null,
      promotion_title: JSON.stringify({ EN: 'Daily Bonus' }),
      description: JSON.stringify({ EN: 'Claimable once every day' }),
      is_active: false,
      created_at: now,
      updated_at: now
    }
  ])
}

export { up, down }
