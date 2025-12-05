'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable('vip_tiers', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        fieldName: 'id',
        _modelAttribute: true,
        field: 'id'
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        fieldName: 'name',
        _modelAttribute: true,
        field: 'name'
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        fieldName: 'level',
        _modelAttribute: true,
        field: 'level'
      },
      xpRequirement: {
        type: DataTypes.INTEGER,
        allowNull: false,
        fieldName: 'xpRequirement',
        _modelAttribute: true,
        field: 'xp_requirement'
      },
      tierUpBonus: {
        type: DataTypes.JSONB,
        allowNull: false,
        fieldName: 'tierUpBonus',
        _modelAttribute: true,
        field: 'tier_up_bonus'
      },
      monthlyPercentage: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        fieldName: 'monthlyPercentage',
        _modelAttribute: true,
        field: 'monthly_percentage'
      },
      weeklyPercentage: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        fieldName: 'weeklyPercentage',
        _modelAttribute: true,
        field: 'weekly_percentage'
      },
      rakebackPercentage: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        fieldName: 'rakebackPercentage',
        _modelAttribute: true,
        field: 'rakeback_percentage'
      },
      issueSpinWheel: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        fieldName: 'issueSpinWheel',
        _modelAttribute: true,
        field: 'issue_spin_wheel'
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true,
        fieldName: 'icon',
        _modelAttribute: true,
        field: 'icon'
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
    return queryInterface.dropTable('vip_tiers')
  }
}
