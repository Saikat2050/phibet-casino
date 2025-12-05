import { KYC_LEVELS } from '@src/utils/constants/public.constants.utils'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'document_labels',
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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
          fieldName: 'description',
          _modelAttribute: true,
          field: 'description'
        },
        isRequired: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          fieldName: 'isRequired',
          _modelAttribute: true,
          field: 'is_required'
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          fieldName: 'isActive',
          _modelAttribute: true,
          field: 'is_active'
        },
        kycLevel: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: KYC_LEVELS.K3,
          fieldName: 'kycLevel',
          _modelAttribute: true,
          field: 'kyc_level'
        },
        // allowedFileTypes: {
        //   type: DataTypes.JSONB,
        //   allowNull: false,
        //   defaultValue: ['jpg', 'jpeg', 'png', 'pdf'],
        //   fieldName: 'allowedFileTypes',
        //   _modelAttribute: true,
        //   field: 'allowed_file_types'
        // },
        // maxFileSize: {
        //   type: DataTypes.BIGINT,
        //   allowNull: false,
        //   defaultValue: 10485760, // 10MB
        //   fieldName: 'maxFileSize',
        //   _modelAttribute: true,
        //   field: 'max_file_size'
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
    return queryInterface.dropTable('document_labels', { schema: 'public' })
  }
} 