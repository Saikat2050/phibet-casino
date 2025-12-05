import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class State extends ModelBase {
  static model = 'gameReportAggregate'

  static table = 'game_report_aggregates'

  static options = {
    name: {
      singular: 'gameReportAggregate',
      plural: 'gameReportAggregates'
    },
    indexes: [
      {
        unique: true,
        fields: ['from_date', 'game_id', 'provider_id', 'currency_id'],
        name: 'unique_from_date_game_provider_currency'
      },
      {
        fields: ['from_date', 'till_date', 'currency_id', 'provider_id', 'game_id'],
        name: 'idx_game_report_aggregates_composite'
      }
    ]
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    tillDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    gameId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    providerId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    totalBetAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    totalWinAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }
}
