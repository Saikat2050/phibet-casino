'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('chat_groups', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'name'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: true,
        field: 'description'
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        field: 'status'
      },
      groupLogo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'group_logo'
      },
      admins: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: false,
        defaultValue: [],
        field: 'admins'
      },
      criteria: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: [],
        field: 'criteria'
      },
      isGlobal: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        default: false,
        field: 'is_global'
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
    await queryInterface.dropTable('chat_groups', { schema: 'public' })
  }
}
