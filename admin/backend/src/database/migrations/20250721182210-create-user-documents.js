import { DOCUMENT_STATUS, KYC_STATUS } from '@src/utils/constants/public.constants.utils'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'user_documents',
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
        documentLabelId: {
          type: DataTypes.BIGINT,
          allowNull: false,
          references: {
            model: 'document_labels',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
          fieldName: 'documentLabelId',
          _modelAttribute: true,
          field: 'document_label_id'
        },
        fileName: {
          type: DataTypes.STRING,
          allowNull: false,
          fieldName: 'fileName',
          _modelAttribute: true,
          field: 'file_name'
        },
        // originalFileName: {
        //   type: DataTypes.STRING,
        //   allowNull: false,
        //   fieldName: 'originalFileName',
        //   _modelAttribute: true,
        //   field: 'original_file_name'
        // },
        fileUrl: {
          type: DataTypes.TEXT,
          allowNull: false,
          fieldName: 'fileUrl',
          _modelAttribute: true,
          field: 'file_url'
        },
        // fileSize: {
        //   type: DataTypes.BIGINT,
        //   allowNull: false,
        //   fieldName: 'fileSize',
        //   _modelAttribute: true,
        //   field: 'file_size'
        // },
        // mimeType: {
        //   type: DataTypes.STRING,
        //   allowNull: false,
        //   fieldName: 'mimeType',
        //   _modelAttribute: true,
        //   field: 'mime_type'
        // },
        status: {
          type: DataTypes.ENUM(Object.values(DOCUMENT_STATUS)),
          allowNull: false,
          defaultValue: 'PENDING',
          fieldName: 'status',
          _modelAttribute: true,
          field: 'status'
        },
        rejectionReason: {
          type: DataTypes.TEXT,
          allowNull: true,
          fieldName: 'rejectionReason',
          _modelAttribute: true,
          field: 'rejection_reason'
        },
        expiryDate: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'expiryDate',
          _modelAttribute: true,
          field: 'expiry_date'
        },
        reviewedBy: {
          type: DataTypes.BIGINT,
          allowNull: true,
          references: {
            model: 'admin_users',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          fieldName: 'reviewedBy',
          _modelAttribute: true,
          field: 'reviewed_by'
        },
        reviewedAt: {
          type: DataTypes.DATE,
          allowNull: true,
          fieldName: 'reviewedAt',
          _modelAttribute: true,
          field: 'reviewed_at'
        },
        metadata: {
          type: DataTypes.JSONB,
          allowNull: true,
          defaultValue: {},
          fieldName: 'metadata',
          _modelAttribute: true,
          field: 'metadata'
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
    return queryInterface.dropTable('user_documents', { schema: 'public' })
  }
} 