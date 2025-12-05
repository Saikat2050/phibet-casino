'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // Add the new column 'new_otp_requested' to the  table
    await queryInterface.addColumn('users', 'new_otp_requested', {
      type: DataTypes.DATE,
      allowNull: true,
      fieldName: 'newOtpRequested',
      _modelAttribute: true,
      field: 'new_otp_requested'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('users', 'new_otp_requested')
  }
}
