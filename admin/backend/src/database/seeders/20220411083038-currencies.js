'use strict'
import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'

const defaultCurrencies = [{
  name: 'Gold Coins',
  code: 'GC',
  type: CURRENCY_TYPES.GOLD_COIN,
  symbol: '$',
  is_default: true
},
{
  name: 'Bonus Sweeps Coins',
  code: 'BSC',
  type: CURRENCY_TYPES.SWEEP_COIN,
  symbol: '$',
  is_default: false
},
{
  name: 'Purchased Sweeps Coins',
  code: 'PSC',
  type: CURRENCY_TYPES.SWEEP_COIN,
  symbol: '$',
  is_default: false
},
{
  name: 'Redeemable Sweeps Coins',
  code: 'RSC',
  type: CURRENCY_TYPES.SWEEP_COIN,
  symbol: '$',
  is_default: false
}]


/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function up (queryInterface, DataTypes) {
  await queryInterface.bulkInsert('currencies', defaultCurrencies.map(defaultCurrency => {
    return {
      ...defaultCurrency,
      created_at: new Date(),
      updated_at: new Date()
    }
  }))
}

/**
 * @param {import('sequelize').QueryInterface} queryInterface
 * @param {import('sequelize').DataTypes} DataTypes
 */
async function down (queryInterface, DataTypes) {
  await queryInterface.bulkDelete('currencies')
}

export { down, up }
