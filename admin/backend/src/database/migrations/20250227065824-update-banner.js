'use strict'

module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.addColumn('users', 'mobile_image_url', {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: [],
      fieldName: 'mobileImageUrl',
      _modelAttribute: true,
      field: 'mobile_image_url'
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('banners', 'mobile_image_url')
  }
}
