module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'packages',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        amount: {
          type: DataTypes.DOUBLE,
          allowNull: true,
          defaultValue: 0.0,
          fieldName: 'amount',
          _modelAttribute: true,
          field: 'amount'
        },
        lable: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'lable',
          _modelAttribute: true,
          field: 'lable'
        },
        gcCoinAmount: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 0,
          fieldName: 'gcCoin',
          _modelAttribute: true,
          field: 'gc_coin'
        },
        scCoinAmount: {
          type: DataTypes.DOUBLE,
          defaultValue: 0,
          fieldName: 'scCoin',
          _modelAttribute: true,
          field: 'sc_coin'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
        },
        isVisibleInStore: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          fieldName: 'isVisibleInStore',
          _modelAttribute: true,
          field: 'is_visible_in_store'
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'imageUrl',
          _modelAttribute: true,
          field: 'image_url'
        },
        orderId: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          fieldName: 'orderId',
          _modelAttribute: true,
          field: 'order_id'
        },
        validTill: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'validTill',
          _modelAttribute: true,
          field: 'valid_till'
        },
        validFrom: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'validFrom',
          _modelAttribute: true,
          field: 'valid_from'
        },
        customizationSettings: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'customizationSettings',
          _modelAttribute: true,
          field: 'customization_settings'
        },
        maxPurchasePerUser: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'maxPurchasePerUser',
          _modelAttribute: true,
          field: 'max_purchase_per_user'
        },
        discountAmount: {
          type: DataTypes.DOUBLE,
          fieldName: 'discountAmount',
          _modelAttribute: true,
          field: 'discount_amount'
        },
        discountEndDate: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'discountEndDate',
          _modelAttribute: true,
          field: 'discount_end_date'
        },
        pricingTiers: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'pricingTiers',
          _modelAttribute: true,
          field: 'pricing_tiers'
        },
        giftable: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          fieldName: 'giftable',
          _modelAttribute: true,
          field: 'giftable'
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
    return queryInterface.dropTable('packages', { schema: 'public' })
  }
}
