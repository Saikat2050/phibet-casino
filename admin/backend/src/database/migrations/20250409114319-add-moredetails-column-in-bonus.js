'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // Add the new column 'moreDetails' to the existing table
    await queryInterface.addColumn('bonus', 'more_details', {
      type: DataTypes.JSONB,
      allowNull: true,
      fieldName: 'moreDetails',
      _modelAttribute: true,
      field: 'more_details'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('bonus', 'more_details')
  }
}
