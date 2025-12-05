'use strict'

module.exports = {
  async up (queryInterface, DataTypes) {
    // Add the new column for unique id to the existing table
    await queryInterface.addColumn('users', 'unique_id', {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4,
      fieldName: 'uniqueId',
      _modelAttribute: true,
      field: 'unique_id'
    })

    await queryInterface.addColumn('users', 'paysafe_customer_id', {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: DataTypes.STRING,
      fieldName: 'paysafeCustomerId',
      _modelAttribute: true,
      field: 'paysafe_customer_id'
    })
  },

  async down (queryInterface, DataTypes) {
    await queryInterface.removeColumn('users', 'unique_id')
  }
}
