'use strict'

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'api_logs',
      {
        id: {
          autoIncrement: true,
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
          field: 'id'
        },
        instance: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'instance'
        },
        endpoint: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'endpoint'
        },
        timestamp: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'timestamp'
        },
        responseTime: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'response_time'
        },
        statusCode: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'status_code'
        },
        isThirdParty: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          field: 'is_third_party'
        },
        thirdPartyServiceProvider: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'third_party_service_provider'
        },
        errorResponse: {
          type: DataTypes.TEXT,
          allowNull: true,
          field: 'error_response'
        },
        request: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'request'
        },
        headers: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'headers'
        },
        response: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'response'
        },
        requestType: {
          type: DataTypes.STRING,
          allowNull: true,
          field: 'request_type'
        },
        modeDetails: {
          type: DataTypes.JSONB,
          allowNull: true,
          field: 'mode_details'
        },
        createdAt: {
          allowNull: false,
          type: DataTypes.DATE,
          field: 'created_at'
        },
        updatedAt: {
          allowNull: false,
          type: DataTypes.DATE,
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
   */
  down: async (queryInterface) => {
    return queryInterface.dropTable('api_logs', { schema: 'public' })
  }
}
