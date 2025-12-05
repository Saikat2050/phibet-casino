'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.removeColumn('users', 'kyc_status')
    await queryInterface.removeColumn('users', 'loyalty_points')
    await queryInterface.removeColumn('users', 'public_address')
    await queryInterface.removeColumn('users', 'nonce')
    await queryInterface.removeColumn('users', 'chat_settings')

    await queryInterface.addColumn('users', 'kyc_status', {
      type: DataTypes.ENUM,
      allowNull: false,
      defaultValue: 'PENDING',
      values: ['PENDING', 'COMPLETED', 'FAILED', 'IN_PROGRESS'],
      fieldName: 'kycStatus',
      _modelAttribute: true,
      field: 'kyc_status'
    })

    await queryInterface.addColumn('users', 'more_details', {
      type: DataTypes.JSONB,
      allowNull: true,
      fieldName: 'moreDetails',
      _modelAttribute: true,
      field: 'more_details'
    })
  },

  down: async (queryInterface, Sequelize) => {
  }
}
