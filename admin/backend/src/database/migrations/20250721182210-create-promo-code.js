'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  /**
   *
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'promo_codes', {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          _modelAttribute: true,
          primaryKey: true,
          allowNull: false,
          fieldName: 'id',
          field: 'id'
        },
        promocode: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'promocode',
          _modelAttribute: true,
          field: 'promocode'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          field: 'is_active',
          fieldName: 'isActive'
        },
        validTill: {
          type: DataTypes.DATE,
          _modelAttribute: true,
          field: 'valid_till',
          fieldName: 'validTill'
        },
        validFrom: {
          type: DataTypes.DATE,
          _modelAttribute: true,
          field: 'valid_from',
          fieldName: 'validFrom'
        },
        maxUsersAvailed: {
          type: DataTypes.BIGINT,
          allowNull: true,
          defaultValue: null,
          _modelAttribute: true,
          field: 'max_users_availed',
          fieldName: 'maxUserAvailed'
        },
        perUserLimit: {
          type: DataTypes.BIGINT,
          _modelAttribute: true,
          field: 'per_user_limit',
          fieldName: 'perUserLimit',
          defaultValue: 0,
          allowNull: false
        },
        isDiscountOnAmount: {
          type: DataTypes.BOOLEAN,
          _modelAttribute: true,
          field: 'is_discount_on_amount',
          fieldName: 'isDiscountOnAmount',
          allowNull: false,
          defaultValue: false
        },
        discountPercentage: {
          type: DataTypes.DOUBLE,
          _modelAttribute: true,
          field: 'discount_percentage',
          fieldName: 'discountPercentage',
          allowNull: false,
          defaultValue: 0
        },
        package: {
          type: DataTypes.ARRAY(DataTypes.INTEGER),
          _modelAttribute: true,
          field: 'package',
          fieldName: 'package',
          allowNull: true
        },
         isArchived: {
          type: DataTypes.BOOLEAN,
          _modelAttribute: true,
          field: 'is_archived',
          fieldName: 'isArchived',
          allowNull: false,
          defaultValue: false
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
        },
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          field: 'deleted_at',
          fieldName: 'deletedAt',
          _modelAttribute: true
        }
      },
      {
        schema: 'public'
      }
    )
  },

  /**
 * @param {import('sequelize').QueryInterface} queryInterface
 */
  down: async (queryInterface, _) => {
    return queryInterface.dropTable('promo_codes', { schema: 'public' })
  }
}
