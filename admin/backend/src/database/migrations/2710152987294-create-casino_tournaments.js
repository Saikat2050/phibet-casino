import { STATUS } from '@src/utils/constants/casinoTournament.constants'
module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    return queryInterface.createTable(
      'casino_tournaments',
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
        name: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'name',
          _modelAttribute: true,
          field: 'name'
        },
        description: {
          type: DataTypes.JSONB,
          allowNull: false,
          fieldName: 'description',
          _modelAttribute: true,
          field: 'description'
        },
        image: {
          type: DataTypes.STRING,
          allowNull: true,
          fieldName: 'image',
          _modelAttribute: true,
          field: 'image'
        },
        startDate: {
          type: DataTypes.DATE,
          allowNull: false,
          fieldName: 'startDate',
          _modelAttribute: true,
          field: 'start_date'
        },
        endDate: {
          type: DataTypes.DATE,
          allowNull: false,
          fieldName: 'endDate',
          _modelAttribute: true,
          field: 'end_date'
        },
        registrationEndDate: {
          type: DataTypes.DATE,
          allowNull: false,
          fieldName: 'registrationEndDate',
          _modelAttribute: true,
          field: 'registration_end_date'
        },
        creditPoints: {
          type: DataTypes.DOUBLE,
          allowNull: false,
          fieldName: 'creditPoints',
          _modelAttribute: true,
          field: 'credit_points'
        },
        status: {
          type: DataTypes.ENUM(Object.values(STATUS)),
          allowNull: false,
          fieldName: 'status',
          _modelAttribute: true,
          field: 'status'
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
    return queryInterface.dropTable('casino_tournaments', { schema: 'public' })
  }
}
