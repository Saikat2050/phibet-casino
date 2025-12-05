import { BONUS_TYPES } from '@src/utils/constants/bonus.constants.utils'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'bonus',
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
        code: {
          type: DataTypes.UUID,
          allowNull: false,
          defaultValue: DataTypes.UUIDV4,
          fieldName: 'code',
          _modelAttribute: true,
          field: 'code'
        },
        bonusType: {
          type: DataTypes.ENUM(Object.values(BONUS_TYPES)),
          allowNull: false,
          fieldName: 'bonusType',
          _modelAttribute: true,
          field: 'bonus_type'
        },
        validFrom: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'validFrom',
          _modelAttribute: true,
          field: 'valid_from'
        },
        validTo: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'validTo',
          _modelAttribute: true,
          field: 'valid_to'
        },
        daysToClear: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'daysToClear',
          _modelAttribute: true,
          field: 'days_to_clear'
        },
        validOnDays: {
          type: DataTypes.INTEGER,
          allowNull: true,
          comment:
            'Represented by binary string of 7 bits, each bit reprents a week day starting from monday',
          fieldName: 'validOnDays',
          _modelAttribute: true,
          field: 'valid_on_days'
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'imageUrl',
          _modelAttribute: true,
          field: 'image_url'
        },
        visibleInPromotions: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          fieldName: 'visibleInPromotions',
          _modelAttribute: true,
          field: 'visible_in_promotions'
        },
        claimedCount: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
          fieldName: 'claimedCount',
          _modelAttribute: true,
          field: 'claimed_count'
        },
        termAndCondition: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'termAndCondition',
          _modelAttribute: true,
          field: 'term_and_condition'
        },
        promotionTitle: {
          type: DataTypes.JSONB,
          allowNull: true,
          fieldName: 'promotionTitle',
          _modelAttribute: true,
          field: 'promotion_title'
        },
        description: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'description',
          _modelAttribute: true,
          field: 'description'
        },
        orderId: {
          type: DataTypes.INTEGER,
          allowNull: true,
          fieldName: 'orderId',
          _modelAttribute: true,
          field: 'order_id'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
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
    return queryInterface.dropTable('bonus', { schema: 'public' })
  }
}
