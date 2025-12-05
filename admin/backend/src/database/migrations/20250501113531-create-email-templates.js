const { EMAIL_TEMPLATE_EVENT_TYPES } = require('@src/utils/constants/public.constants.utils')

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'email_templates',
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
        label: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'label',
          _modelAttribute: true,
          field: 'label'
        },
        eventType: {
          type: DataTypes.ENUM,
          allowNull: false,
          values: [...Object.values(EMAIL_TEMPLATE_EVENT_TYPES)],
          fieldName: 'eventType',
          _modelAttribute: true,
          field: 'event_type'
        },
        dynamicData: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'dynamicData',
          _modelAttribute: true,
          field: 'dynamic_data'
        },
        templateCode: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'templateCode',
          _modelAttribute: true,
          field: 'template_code'
        },
        isDefault: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          fieldName: 'isDefault',
          _modelAttribute: true,
          field: 'is_default'
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
    return queryInterface.dropTable('email_templates', { schema: 'public' })
  }
}
