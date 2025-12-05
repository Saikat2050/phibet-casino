'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('withdrawals', 'more_details', {
      type: DataTypes.JSONB,
      allowNull: true,
      fieldName: 'moreDetails',
      _modelAttribute: true,
      field: 'more_details',
      defaultValue: {}
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('withdrawals', 'more_details')
  }
}
