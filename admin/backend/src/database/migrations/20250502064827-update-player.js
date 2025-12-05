'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('users', 'phone_otp', {
      type: DataTypes.STRING,
      allowNull: true,
      fieldName: 'phoneOtp',
      _modelAttribute: true,
      field: 'phone_otp'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('users', 'phone_otp')
  }
}
