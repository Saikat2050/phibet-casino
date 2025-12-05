'use strict'

/** @type {import('sequelize-cli').Migration} */

async function up (queryInterface, Sequelize) {
  console.log('Starting bonus currency seeder for currency ID 1...')
  
  const transaction = await queryInterface.sequelize.transaction()
  
  try {
    // Step 1: Check if required tables exist
    const tables = await queryInterface.sequelize.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' 
       AND table_name IN ('bonus', 'bonus_currencies', 'currencies')`,
      {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      }
    )
    console.log("tables",tables)
    const tableNames = tables.map(t => t[0])
    console.log("tablesnames",tableNames)
    
    
    if (!tableNames.includes('bonus')) {
      console.log('❌ Bonus table does not exist, rolling back to prevent migration entry')
      await transaction.rollback()
      throw new Error('Required table "bonus" does not exist')
    }

    if (!tableNames.includes('bonus_currencies')) {
      console.log('❌ Bonus currencies table does not exist, rolling back to prevent migration entry')
      await transaction.rollback()
      throw new Error('Required table "bonus_currencies" does not exist')
    }

    if (!tableNames.includes('currencies')) {
      console.log('❌ Currencies table does not exist, rolling back to prevent migration entry')
      await transaction.rollback()
      throw new Error('Required table "currencies" does not exist')
    }

    console.log('✅ All required tables exist')
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback()
    }
    if (error.message.includes('does not exist')) {
      throw error
    }
    console.error('❌ Error checking table existence:', error.message)
    throw new Error(`Failed to check table existence: ${error.message}`)
  }

  // Step 2: Check if currency with ID 1 exists
  try {
    const currency = await queryInterface.sequelize.query(
      'SELECT id FROM currencies WHERE id = 1',
      {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      }
    )

    if (currency.length === 0) {
      console.log('❌ Currency with ID 1 does not exist, rolling back to prevent migration entry')
      await transaction.rollback()
      throw new Error('Currency with ID 1 does not exist')
    }
    
    console.log('✅ Currency with ID 1 exists')
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback()
    }
    if (error.message.includes('does not exist')) {
      throw error
    }
    console.error('❌ Error checking currency existence:', error.message)
    throw new Error(`Failed to check currency existence: ${error.message}`)
  }

  // Step 3: Get all bonuses
  let bonuses = []
  try {
    bonuses = await queryInterface.sequelize.query(
      'SELECT id FROM bonus',
      {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      }
    )

    if (bonuses.length === 0) {
      console.log('❌ No bonuses found, rolling back to prevent migration entry')
      await transaction.rollback()
      throw new Error('No bonuses found in database')
    }
    
    console.log(`✅ Found ${bonuses.length} bonuses`)
  } catch (error) {
    if (!transaction.finished) {
      await transaction.rollback()
    }
    if (error.message.includes('No bonuses found')) {
      throw error
    }
    console.error('❌ Error fetching bonuses:', error.message)
    throw new Error(`Failed to fetch bonuses: ${error.message}`)
  }

  // Step 4: Get existing bonus currency records for currency ID 1
  let existingBonusIds = []
  try {
    const existingBonusCurrencies = await queryInterface.sequelize.query(
      'SELECT bonus_id FROM bonus_currencies WHERE currency_id = 1',
      {
        type: Sequelize.QueryTypes.SELECT,
        transaction
      }
    )

    existingBonusIds = existingBonusCurrencies.map(bc => bc.bonus_id)
    console.log(`✅ Found ${existingBonusIds.length} existing bonus currency records for currency ID 1`)
  } catch (error) {
    await transaction.rollback()
    console.error('❌ Error fetching existing bonus currencies:', error.message)
    throw new Error(`Failed to fetch existing bonus currencies: ${error.message}`)
  }

  // Step 5: Filter bonuses that don't have currency ID 1 records
  const bonusesToAdd = bonuses.filter(bonus => !existingBonusIds.includes(bonus.id))

  if (bonusesToAdd.length === 0) {
    console.log('✅ All bonuses already have currency ID 1 records, nothing to add')
    await transaction.commit()
    return
  }

  console.log(`📝 Will add ${bonusesToAdd.length} new bonus currency records`)

  // Step 6: Create bonus currency records for currency ID 1
  try {
    const now = new Date()
    const bonusCurrencyData = bonusesToAdd.map(bonus => ({
      currency_id: 1,
      bonus_id: bonus.id,
      zero_out_threshold: 1.0,
      amount: 0.0,
      min_deposit_amount: 0.0,
      min_bet_amount: 0.0,
      max_bonus_claimed: 0.0,
      created_at: now,
      updated_at: now
    }))

    await queryInterface.bulkInsert('bonus_currencies', bonusCurrencyData, { transaction })
    await transaction.commit()

    console.log(`✅ Successfully added ${bonusCurrencyData.length} bonus currency records for currency ID 1`)
    
  } catch (error) {
    await transaction.rollback()
    console.error('❌ Error inserting bonus currency data:', error.message)
    throw new Error(`Failed to insert bonus currency data: ${error.message}`)
  }
}

async function down (queryInterface) {
  console.log('Starting rollback of bonus currency seeder for currency ID 1...')
  
  // Check if bonus_currencies table exists
  try {
    const tables = await queryInterface.sequelize.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public' AND table_name = 'bonus_currencies'`,
      {
        type: queryInterface.sequelize.QueryTypes.SELECT
      }
    )

    if (tables.length === 0) {
      console.log('❌ Bonus currencies table does not exist, nothing to rollback')
      return
    }
  } catch (error) {
    console.error('❌ Error checking table existence during rollback:', error.message)
    return
  }

  const transaction = await queryInterface.sequelize.transaction()

  try {
    // Remove all bonus currency records for currency ID 1
    const result = await queryInterface.bulkDelete(
      'bonus_currencies',
      { currency_id: 1 },
      { transaction }
    )

    await transaction.commit()
    console.log(`✅ Successfully removed bonus currency records for currency ID 1 (${result} records affected)`)
  } catch (error) {
    await transaction.rollback()
    console.error('❌ Error during rollback:', error.message)
    console.log('ℹ️  Rollback completed with errors but did not fail')
  }
}

export { up, down }