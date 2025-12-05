module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'user_payment_cards',
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
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE'
        },
        cardNumber: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'cardNumber',
          _modelAttribute: true,
          field: 'card_number'
        },
        expiryMonth: {
          type: DataTypes.INTEGER,
          allowNull: false,
          fieldName: 'expiryMonth',
          _modelAttribute: true,
          field: 'expiry_month'
        },
        expiryYear: {
          type: DataTypes.INTEGER,
          allowNull: false,
          fieldName: 'expiryYear',
          _modelAttribute: true,
          field: 'expiry_year'
        },
        cardHolderName: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'cardHolderName',
          _modelAttribute: true,
          field: 'card_holder_name'
        },
        cardType: {
          type: DataTypes.ENUM('VISA', 'MASTERCARD', 'AMEX', 'DISCOVER', 'OTHER'),
          allowNull: false,
          defaultValue: 'OTHER',
          fieldName: 'cardType',
          _modelAttribute: true,
          field: 'card_type'
        },
        isDefault: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          fieldName: 'isDefault',
          _modelAttribute: true,
          field: 'is_default'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
        },
        isCreditCard: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          fieldName: 'isCreditCard',
          _modelAttribute: true,
          field: 'is_credit_card'
        },
        moreDetails: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: {},
          fieldName: 'moreDetails',
          _modelAttribute: true,
          field: 'more_details'
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
    return queryInterface.dropTable('user_payment_cards', { schema: 'public' })
  }
}