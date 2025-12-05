module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'user_bonus',
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
          onDelete: 'NO ACTION',
          onUpdate: 'CASCADE'
        },
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          fieldName: 'userId',
          _modelAttribute: true,
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
          },
          onDelete: 'cascade',
          onUpdate: 'CASCADE'
        },
        transactionId: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true,
          fieldName: 'transactionId',
          _modelAttribute: true,
          field: 'transaction_id'
        },
        amountToWager: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          fieldName: 'amountToWager',
          _modelAttribute: true,
          field: 'amount_to_wager'
        },
        wageredAmount: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0,
          fieldName: 'wageredAmount',
          _modelAttribute: true,
          field: 'wagered_amount'
        },
        cashAmount: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          comment: 'deposit bonus',
          fieldName: 'cashAmount',
          _modelAttribute: true,
          field: 'cash_amount'
        },
        status: {
          type: DataTypes.ENUM,
          allowNull: false,
          defaultValue: 'pending',
          values: [
            'pending',
            'active',
            'cancelled',
            'forfitted',
            'expired',
            'claimed',
            'claiming',
            'in_process',
            'lapsed',
            'zeroed_out'
          ],
          fieldName: 'status',
          _modelAttribute: true,
          field: 'status'
        },
        claimedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'claimedAt',
          _modelAttribute: true,
          field: 'claimed_at'
        },
        expireAt: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'expireAt',
          _modelAttribute: true,
          field: 'expire_at'
        },
        issuerId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'issuerId',
          _modelAttribute: true,
          field: 'issuer_id'
        },
        cancelledBy: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'cancelledBy',
          _modelAttribute: true,
          field: 'cancelled_by'
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
    return queryInterface.dropTable('user_bonus', { schema: 'public' })
  }
}
