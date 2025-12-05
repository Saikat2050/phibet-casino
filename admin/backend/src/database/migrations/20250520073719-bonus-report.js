
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'bonus_report',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        vipTierMonthlyBonusCount: {
          allowNull: false,
          type: DataTypes.BIGINT,
          defaultValue: 0,
          fieldName: 'vipTierMonthlyBonusCount',
          _modelAttribute: true,
          field: 'vip_tier_monthly_bonus_count'
        },
        vipTierMonthlyBonusGCRewards: {
          allowNull: false,
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          fieldName: 'vipTierMonthlyBonusGCRewards',
          _modelAttribute: true,
          field: 'vip_tier_monthly_bonus_gc_rewards'
        },
        vipTierMonthlyBonusSCRewards: {
          allowNull: false,
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          fieldName: 'vipTierMonthlyBonusSCRewards',
          _modelAttribute: true,
          field: 'vip_tier_monthly_bonus_sc_rewards'
        },
        vipTierWeeklyBonusCount: {
          allowNull: false,
          type: DataTypes.BIGINT,
          defaultValue: 0,
          fieldName: 'vipTierWeeklyBonusCount',
          _modelAttribute: true,
          field: 'vip_tier_weekly_bonus_count'
        },
        vipTierWeeklyBonusGCRewards: {
          allowNull: false,
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          fieldName: 'vipTierWeeklyBonusGCRewards',
          _modelAttribute: true,
          field: 'vip_tier_weekly_bonus_gc_rewards'
        },
        vipTierWeeklyBonusSCRewards: {
          allowNull: false,
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          fieldName: 'vipTierWeeklyBonusSCRewards',
          _modelAttribute: true,
          field: 'vip_tier_weekly_bonus_sc_rewards'
        },
        purchaseBonusCount: {
          allowNull: false,
          type: DataTypes.BIGINT,
          defaultValue: 0,
          fieldName: 'purchaseBonusCount',
          _modelAttribute: true,
          field: 'purchase_bonus_count'
        },
        purchaseBonusSCRewards: {
          allowNull: false,
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          fieldName: 'purchaseBonusSCRewards',
          _modelAttribute: true,
          field: 'purchase_bonus_sc_rewards'
        },
        spinWheelBonusCount: {
          allowNull: false,
          type: DataTypes.BIGINT,
          defaultValue: 0,
          fieldName: 'spinWheelBonusCount',
          _modelAttribute: true,
          field: 'spin_wheel_bonus_count'
        },
        spinWheelBonusGCRewards: {
          allowNull: false,
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          fieldName: 'spinWheelBonusGCRewards',
          _modelAttribute: true,
          field: 'spin_wheel_bonus_gc_rewards'
        },
        spinWheelBonusSCRewards: {
          allowNull: false,
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          fieldName: 'spinWheelBonusSCRewards',
          _modelAttribute: true,
          field: 'spin_wheel_bonus_sc_rewards'
        },
        joiningBonusCount: {
          allowNull: false,
          type: DataTypes.BIGINT,
          defaultValue: 0,
          fieldName: 'joiningBonusCount',
          _modelAttribute: true,
          field: 'joining_bonus_count'
        },
        joiningBonusGCRewards: {
          allowNull: false,
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          fieldName: 'joiningBonusGCRewards',
          _modelAttribute: true,
          field: 'joining_bonus_gc_rewards'
        },
        joiningBonusSCRewards: {
          allowNull: false,
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          fieldName: 'joiningBonusSCRewards',
          _modelAttribute: true,
          field: 'joining_bonus_sc_rewards'
        },
        dailyBonusCount: {
          allowNull: false,
          type: DataTypes.BIGINT,
          defaultValue: 0,
          fieldName: 'dailyBonusCount',
          _modelAttribute: true,
          field: 'daily_bonus_count'
        },
        dailyBonusGCRewards: {
          allowNull: false,
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          fieldName: 'dailyBonusGCRewards',
          _modelAttribute: true,
          field: 'daily_bonus_gc_rewards'
        },
        dailyBonusSCRewards: {
          allowNull: false,
          type: DataTypes.DOUBLE,
          defaultValue: 0.0,
          fieldName: 'dailyBonusSCRewards',
          _modelAttribute: true,
          field: 'daily_bonus_sc_rewards'
        },
        playerRegisterCount: {
          type: DataTypes.BIGINT,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'playerRegisterCount',
          _modelAttribute: true,
          field: 'player_register_count'
        },
        isInternal: {
          allowNull: true,
          type: DataTypes.BOOLEAN,
          fieldName: 'isInternal',
          _modelAttribute: true,
          field: 'is_internal'
        },
        fromDate: {
          allowNull: false,
          type: DataTypes.DATE,
          fieldName: 'fromDate',
          _modelAttribute: true,
          field: 'from_date'
        },
        toDate: {
          allowNull: false,
          type: DataTypes.DATE,
          fieldName: 'toDate',
          _modelAttribute: true,
          field: 'to_date'
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
          fieldName: 'updatedAt',
          _modelAttribute: true,
          field: 'updated_at'
        }
      },
      {
        schema: 'public'
      }
    )
  },
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  down: async (queryInterface, _) => {
    return queryInterface.dropTable('bonus_report', { schema: 'public' })
  }
}
