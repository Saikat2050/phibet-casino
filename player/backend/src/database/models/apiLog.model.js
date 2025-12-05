import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class APILogs extends ModelBase {
  static model = 'apiLog'

  static table = 'api_logs'

  static options = {
    name: {
      singular: 'api_log',
      plural: 'api_logs'
    },
    // underscored: true,
    paranoid: false,
    timestamps: true,
    schema: 'public'
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    instance: {
      type: DataTypes.STRING
    },
    endpoint: {
      type: DataTypes.STRING
    },
    timestamp: {
      type: DataTypes.STRING
    },
    responseTime: {
      type: DataTypes.STRING
    },
    statusCode: {
      type: DataTypes.STRING
    },
    isThirdParty: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    thirdPartyServiceProvider: {
      type: DataTypes.STRING
    },
    errorResponse: {
      type: DataTypes.TEXT
    },
    request: {
      type: DataTypes.JSONB
    },
    headers: {
      type: DataTypes.JSONB
    },
    response: {
      type: DataTypes.JSONB
    },
    requestType: {
      type: DataTypes.STRING
    },
    modeDetails: {
      type: DataTypes.JSONB
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }

  static associate (models) {
    // No associations for now
    super.associate()
  }
}
