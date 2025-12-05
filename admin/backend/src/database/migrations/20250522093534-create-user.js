'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.addColumn('users', 'auth_enable', {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        fieldName: 'authEnable',
        defaultValue: false,
        _modelAttribute: true,
        field: 'auth_enable'
      }),
      queryInterface.addColumn('users', 'auth_url', {
        type: DataTypes.STRING,
        allowNull: true,
        fieldName: 'authUrl',
        _modelAttribute: true,
        field: 'auth_url'
      }),
      queryInterface.addColumn('users', 'auth_secret', {
        type: DataTypes.STRING,
        allowNull: true,
        fieldName: 'authSecret',
        _modelAttribute: true,
        field: 'auth_secret'
      })
    ])
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('wallets', 'vault_amount')
  }
}
