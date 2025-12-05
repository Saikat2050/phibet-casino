'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable('user_vip_tiers', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        fieldName: 'id',
        _modelAttribute: true,
        field: 'id'
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id',
        references: {
          model: {
            tableName: 'users',
            table: 'users',
            name: 'user',
            schema: 'public',
            delimiter: '.'
          },
          key: 'id'
        }
      },
      vipLevelId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        fieldName: 'vipLevelId',
        _modelAttribute: true,
        field: 'vip_level_id',
        defaultValue: 1,
        references: {
          model: {
            tableName: 'vip_tiers',
            table: 'vip_tiers',
            name: 'vip_tiers',
            schema: 'public',
            delimiter: '.'
          },
          key: 'id'
        }
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        fieldName: 'isActive',
        _modelAttribute: true,
        field: 'is_active'
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        fieldName: 'createdAt',
        _modelAttribute: true,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        fieldName: 'updateddAt',
        _modelAttribute: true,
        field: 'updated_at'
      }
    })
  },

  down: async (queryInterface, _) => {
    return queryInterface.dropTable('user_vip_tiers')
  }
}
