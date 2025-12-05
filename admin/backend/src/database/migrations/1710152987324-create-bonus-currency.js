module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'bonus_currencies',
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
        bonusId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'bonusId',
          _modelAttribute: true,
          field: 'bonus_id',
          references: {
            model: {
              tableName: 'bonus',
              table: 'bonus',
              name: 'bonus',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        currencyId: {
          type: DataTypes.BIGINT,
          allowNull: false,
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
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        zeroOutThreshold: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 1,
          fieldName: 'zeroOutThreshold',
          _modelAttribute: true,
          field: 'zero_out_threshold'
        },
        joiningAmount: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          comment: 'welcome bonus',
          fieldName: 'joiningAmount',
          _modelAttribute: true,
          field: 'joining_amount'
        },
        minDepositAmount: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          comment: 'deposit_bonus',
          fieldName: 'minDepositAmount',
          _modelAttribute: true,
          field: 'min_deposit_amount'
        },
        minBetAmount: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          comment: 'bet_bonus',
          fieldName: 'minBetAmount',
          _modelAttribute: true,
          field: 'min_bet_amount'
        },
        maxBonusClaimed: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'maxBonusClaimed',
          _modelAttribute: true,
          field: 'max_bonus_claimed'
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
    return queryInterface.dropTable('bonus_currencies', { schema: 'public' })
  }
}
