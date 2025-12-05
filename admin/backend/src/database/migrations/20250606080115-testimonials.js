'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'testimonials',
      {
        id: {
          allowNull: false,
          type: DataTypes.BIGINT,
          primaryKey: true,
          autoIncrement: true,
          fieldName: 'id',
          _modelAttribute: true,
          field: 'id'
        },
        author: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'author',
          _modelAttribute: true,
          field: 'author'
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
          fieldName: 'content',
          _modelAttribute: true,
          field: 'content'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
        },
        rating: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          defaultValue: 5,
          fieldName: 'rating',
          _modelAttribute: true,
          field: 'rating'
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
    return queryInterface.dropTable('testimonials', { schema: 'public' })
  }
}
