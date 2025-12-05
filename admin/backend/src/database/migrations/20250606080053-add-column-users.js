'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await queryInterface.addColumn('users', 'is_profile', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      fieldName: 'isProfile',
      _modelAttribute: true,
      field: 'is_profile'
    })

    await queryInterface.addColumn('users', 'is_update_profile', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      fieldName: 'isUpdateProfile',
      _modelAttribute: true,
      field: 'is_update_profile'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('users', 'is_profile')
    await queryInterface.removeColumn('users', 'is_update_profile')
  }
}
