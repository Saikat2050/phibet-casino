'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('tips', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id'
      },
      recipientId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'recipient_id'
      },
      amount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'amount'
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'currency'
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'updated_at'
      }

    }, { schema: 'public' })
  },

  down: async (queryInterface, _) => {
    await queryInterface.dropTable('tips', { schema: 'public' })
  }
}
