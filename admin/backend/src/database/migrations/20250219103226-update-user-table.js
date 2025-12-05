'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.addColumn('users', 'new_password_key', {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: '',
        fieldName: 'newPasswordKey',
        _modelAttribute: true,
        field: 'new_password_key'
      }),

      queryInterface.addColumn('users', 'new_password_requested', {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: '',
        fieldName: 'newPasswordRequested',
        _modelAttribute: true,
        field: 'new_password_requested'
      }),

      queryInterface.addColumn('users', 'email_token', {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '',
        fieldName: 'emailToken',
        _modelAttribute: true,
        field: 'email_token'
      }),

      queryInterface.addColumn('users', 'new_email_requested', {
        allowNull: true,
        type: DataTypes.STRING,
        defaultValue: '',
        fieldName: 'newEmailRequested',
        _modelAttribute: true,
        field: 'new_email_requested'
      })
    ])
  },

  async down (queryInterface, DataTypes) {
    await Promise.all([
      queryInterface.removeColumn('users', 'new_password_key'),
      queryInterface.removeColumn('users', 'new_password_requested'),
      queryInterface.removeColumn('users', 'email_token'),
      queryInterface.removeColumn('users', 'new_email_requested')
    ])
  }
}
