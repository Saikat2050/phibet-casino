'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // Add the new column for descriptions to the existing table
    await queryInterface.addColumn('payment_providers', 'withdraw_description', {
      type: DataTypes.JSONB,
      allowNull: true,
      fieldName: 'withdrawDescription',
      _modelAttribute: true,
      field: 'withdraw_description',
      defaultValue: JSON.stringify({
        EN: 'Withdraw'
      })
    })

    await queryInterface.addColumn('payment_providers', 'deposit_description', {
      type: DataTypes.JSONB,
      allowNull: true,
      fieldName: 'depositDescription',
      _modelAttribute: true,
      field: 'deposit_description',
      defaultValue: JSON.stringify({
        EN: 'Deposit'
      })
    })

    await queryInterface.addColumn('payment_providers', 'deposit_image', {
      type: DataTypes.STRING,
      allowNull: true,
      fieldName: 'depositImage',
      _modelAttribute: true,
      field: 'deposit_image'
    })

    await queryInterface.addColumn('payment_providers', 'withdraw_image', {
      type: DataTypes.STRING,
      allowNull: true,
      fieldName: 'withdrawImage',
      _modelAttribute: true,
      field: 'withdraw_image'
    })

    await queryInterface.addColumn('payment_providers', 'deposit_kyc_required', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      fieldName: 'depositKycRequired',
      _modelAttribute: true,
      field: 'deposit_kyc_required',
      defaultValue: true
    })

    await queryInterface.addColumn('payment_providers', 'withdraw_kyc_required', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      fieldName: 'withdrawKycRequired',
      _modelAttribute: true,
      field: 'withdraw_kyc_required',
      defaultValue: true
    })

    await queryInterface.addColumn('payment_providers', 'deposit_profile_required', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      fieldName: 'depositProfileRequired',
      _modelAttribute: true,
      field: 'deposit_profile_required',
      defaultValue: true
    })

    await queryInterface.addColumn('payment_providers', 'withdraw_profile_required', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      fieldName: 'withdrawProfileRequired',
      _modelAttribute: true,
      field: 'withdraw_profile_required',
      defaultValue: true
    })

    await queryInterface.addColumn('payment_providers', 'deposit_phone_required', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      fieldName: 'depositPhoneRequired',
      _modelAttribute: true,
      field: 'deposit_phone_required',
      defaultValue: true
    })

    await queryInterface.addColumn('payment_providers', 'withdraw_phone_required', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      fieldName: 'withdrawPhoneRequired',
      _modelAttribute: true,
      field: 'withdraw_phone_required',
      defaultValue: true
    })

    await queryInterface.addColumn('payment_providers', 'min_withdraw', {
      type: DataTypes.FLOAT,
      allowNull: true,
      fieldName: 'minWithdraw',
      _modelAttribute: true,
      field: 'min_withdraw'
    })

    await queryInterface.addColumn('payment_providers', 'max_withdraw', {
      type: DataTypes.FLOAT,
      allowNull: true,
      fieldName: 'withdrawPhoneRequired',
      _modelAttribute: true,
      field: 'max_withdraw'
    })

    await queryInterface.removeColumn('payment_providers', 'description')
    await queryInterface.removeColumn('payment_providers', 'image')
    await queryInterface.dropTable('provider_limits', { schema: 'public' })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('payment_providers', 'withdraw_description')
  }
}
