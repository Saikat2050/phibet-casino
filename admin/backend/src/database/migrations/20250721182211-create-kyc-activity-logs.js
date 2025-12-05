import { DOCUMENT_STATUS, KYC_ACTIONS, KYC_STATUS } from '@src/utils/constants/public.constants.utils'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'kyc_activity_logs',
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
        userId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          fieldName: 'userId',
          _modelAttribute: true,
          field: 'user_id'
        },
        adminUserId: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: 'admin_users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          fieldName: 'adminUserId',
          _modelAttribute: true,
          field: 'admin_user_id'
        },
        action: {
          type: DataTypes.ENUM(Object.values(KYC_ACTIONS)),
          allowNull: false,
          fieldName: 'action',
          _modelAttribute: true,
          field: 'action'
        },
        // entityType: {
        //   type: DataTypes.STRING,
        //   allowNull: false,
        //   fieldName: 'entityType',
        //   _modelAttribute: true,
        //   field: 'entity_type'
        // },
        // entityId: {
        //   type: DataTypes.BIGINT,
        //   allowNull: true,
        //   fieldName: 'entityId',
        //   _modelAttribute: true,
        //   field: 'entity_id'
        // },
        previousStatus: {
          type: DataTypes.ENUM(...new Set([
            ...Object.values(KYC_STATUS),
            ...Object.values(DOCUMENT_STATUS)
          ])),
          allowNull: true,
          fieldName: 'previousStatus',
          _modelAttribute: true,
          field: 'previous_status'
        },
        newStatus: {
          type: DataTypes.ENUM(...new Set([
            ...Object.values(KYC_STATUS),
            ...Object.values(DOCUMENT_STATUS)
          ])),
          allowNull: true,
          fieldName: 'newStatus',
          _modelAttribute: true,
          field: 'new_status'
        },
        reason: {
          type: DataTypes.TEXT,
          allowNull: true,
          fieldName: 'reason',
          _modelAttribute: true,
          field: 'reason'
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: {},
          fieldName: 'metadata',
          _modelAttribute: true,
          field: 'metadata'
        },
        // ipAddress: {
        //   type: DataTypes.STRING,
        //   allowNull: true,
        //   fieldName: 'ipAddress',
        //   _modelAttribute: true,
        //   field: 'ip_address'
        // },
        // userAgent: {
        //   type: DataTypes.TEXT,
        //   allowNull: true,
        //   fieldName: 'userAgent',
        //   _modelAttribute: true,
        //   field: 'user_agent'
        // },
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
    return queryInterface.dropTable('kyc_activity_logs', { schema: 'public' })
  }
} 