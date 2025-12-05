'use strict'
const { PAGES_CATEGORY } = require('@src/utils/constants/public.constants.utils')

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('pages', 'category', {
      type: DataTypes.ENUM,
      allowNull: true,
      values: Object.values(PAGES_CATEGORY),
      fieldName: 'category',
      _modelAttribute: true,
      field: 'category'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('pages', 'category')
  }
}
