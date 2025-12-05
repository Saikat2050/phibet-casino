'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('banners', 'mobile_image_url', {
      type: DataTypes.JSONB,
      allowNull: true,
      fieldName: 'mobileImageUrl',
      _modelAttribute: true,
      field: 'mobile_image_url'
    })
    await queryInterface.removeColumn('banners', 'image_url')
    await queryInterface.addColumn('banners', 'image_url', {
      type: DataTypes.JSONB,
      allowNull: true,
      fieldName: 'imageUrl',
      _modelAttribute: true,
      field: 'image_url'
    })
    await queryInterface.sequelize.query('ALTER TYPE "enum_banners_type" ADD VALUE IF NOT EXISTS \'store\'')
  },

  async down (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.removeColumn('banners', 'mobile_image_url'),
      queryInterface.addColumn('banners', 'image_url', {
        type: DataTypes.STRING,
        allowNull: true,
        fieldName: 'imageUrl',
        _modelAttribute: true,
        field: 'image_url'
      }),
      queryInterface.removeColumn('banners', 'image_url')
    ])
  }
}
