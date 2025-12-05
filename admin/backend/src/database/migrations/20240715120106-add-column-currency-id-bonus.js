'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // Add the new column 'currency_id' to the existing table
    await queryInterface.addColumn('user_bonus', 'currency_id', {
      type: DataTypes.BIGINT,
      allowNull: true,
      fieldName: 'currencyId',
      _modelAttribute: true,
      field: 'currency_id',
      references: {
        model: {
          tableName: 'currencies',
          table: 'currencies',
          name: 'currency',
          schema: 'public',
          delimiter: '.'
        },
        key: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    })
  },

  async down (queryInterface, DataTypes) {
    // Remove the added column 'currency_id' from the table during rollback
    await queryInterface.removeColumn('user_bonus', 'currency_id')
  }
}
