const { DEFAULT_SITE_LAYOUT } = require('@src/utils/constants/app.constants')

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'admin_users',
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
        firstName: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'firstName',
          _modelAttribute: true,
          field: 'first_name'
        },
        lastName: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'lastName',
          _modelAttribute: true,
          field: 'last_name'
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          fieldName: 'username',
          _modelAttribute: true,
          field: 'username'
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          fieldName: 'email',
          _modelAttribute: true,
          field: 'email'
        },
        emailVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          fieldName: 'emailVerified',
          _modelAttribute: true,
          field: 'email_verified'
        },
        phone: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'phone',
          _modelAttribute: true,
          field: 'phone'
        },
        phoneVerified: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
          fieldName: 'phoneVerified',
          _modelAttribute: true,
          field: 'phone_verified'
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'password',
          _modelAttribute: true,
          field: 'password'
        },
        parentAdminId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'parentAdminId',
          _modelAttribute: true,
          field: 'parent_admin_id',
          references: {
            model: {
              tableName: 'admin_users',
              table: 'admin_users',
              name: 'adminUser',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        adminRoleId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          fieldName: 'adminRoleId',
          _modelAttribute: true,
          field: 'admin_role_id',
          references: {
            model: {
              tableName: 'admin_roles',
              table: 'admin_roles',
              name: 'adminRole',
              schema: 'public',
              delimiter: '.'
            },
            key: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        siteLayout: {
          type: DataTypes.JSONB,
          defaultValue: DEFAULT_SITE_LAYOUT,
          fieldName: 'siteLayout',
          _modelAttribute: true,
          field: 'site_layout',
          allowNull: false
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
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
    return queryInterface.dropTable('admin_users', { schema: 'public' })
  }
}
