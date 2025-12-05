'use strict'

import { PAYMENT_PROVIDER_CATEGORY, PAYMENT_PROVIDER, PAYMENT_AGGREGATOR } from '@src/utils/constants/payment.constants'

/** @type {import('sequelize-cli').Migration} */

async function up (queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()
  try {
    await queryInterface.bulkInsert('payment_providers', [{
      name: JSON.stringify({
        EN: PAYMENT_PROVIDER.COINFLOW
      }),
      aggregator: PAYMENT_AGGREGATOR.APPROVELY,
      category: PAYMENT_PROVIDER_CATEGORY.INSTANT_BANKING,
      deposit_image: '',
      withdraw_image: '',
      deposit_description: JSON.stringify({
        EN: PAYMENT_PROVIDER.COINFLOW
      }),
      withdraw_description: JSON.stringify({
        EN: PAYMENT_PROVIDER.COINFLOW
      }),
      deposit_kyc_required: true,
      withdraw_kyc_required: true,
      deposit_profile_required: true,
      withdraw_profile_required: true,
      deposit_phone_required: true,
      withdraw_phone_required: true,
      created_at: new Date(),
      updated_at: new Date()
    }], { returning: true, transaction })

    await transaction.commit()
  } catch (error) {
    await transaction.rollback()
  }
}

async function down (queryInterface, Sequelize) {
  await queryInterface.bulkDelete('payment_providers')
  await queryInterface.bulkDelete('provider_limits')
}

export { down, up }
