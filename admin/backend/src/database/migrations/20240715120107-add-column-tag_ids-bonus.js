'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // Add the new column 'tag_ids' to the existing table
    await queryInterface.addColumn('bonus', 'tag_ids', {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true,
      fieldName: 'tagIds',
      _modelAttribute: true,
      field: 'tag_ids'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('bonus', 'tag_ids')
  }
}
