'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.changeColumn('users', 'password', {
        type: DataTypes.STRING,
        allowNull: true,
        fieldName: 'password',
        _modelAttribute: true,
        field: 'password'
      }),
      queryInterface.addColumn('users', 'sign_in_method', {
        type: DataTypes.ENUM,
        values: ['email', 'google', 'facebook'],
        allowNull: false,
        fieldName: 'signInMethod',
        _modelAttribute: true,
        field: 'sign_in_method',
        defaultValue: 'email'
      })
    ])
  },

  async down (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.changeColumn('users', 'password', {
        type: DataTypes.STRING,
        allowNull: false,
        fieldName: 'password',
        _modelAttribute: true,
        field: 'password'
      }),
      queryInterface.removeColumn('users', 'sign_in_method')
    ])
  }
}
