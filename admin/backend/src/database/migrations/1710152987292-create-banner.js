import { BANNER_TYPES } from '@src/utils/constants/public.constants.utils'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'banners',
      {
        id: {
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        type: {
          type: DataTypes.ENUM(Object.values(BANNER_TYPES)),
          allowNull: true,
          fieldName: 'type',
          _modelAttribute: true,
          field: 'type'
        },
        imageUrl: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'image_url',
          _modelAttribute: true,
          field: 'image_url'
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false,
          fieldName: 'createdAt',
          _modelAttribute: true,
          field: 'created_at'
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false,
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
    return queryInterface.dropTable('banners', { schema: 'public' })
  }
}
