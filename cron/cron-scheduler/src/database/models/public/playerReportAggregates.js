import { DataTypes } from 'sequelize'
import { ModelBase } from '../modelBase'

export class PlayerReportAggregate extends ModelBase {
  static model = 'playerReportAggregate'

  static table = 'player_report_aggregates'

  static options = {
    name: {
      singular: 'playerReportAggregate',
      plural: 'playerReportAggregates'
    },
    indexes: [
      {
        unique: true,
        fields: ['user_id', 'from_date', 'till_date'],
        name: 'unique_user_id_from_date_till_date',
      },
      {
        fields: ['from_date', 'till_date'],
        name: 'idx_player_report_aggregates_dates',
      },
      {
        fields: ['user_id'],
        name: 'idx_player_report_aggregates_userId',
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
    userId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    fromDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    tillDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    gcStakedAmount: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    gcBetCount: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    scStakedAmount: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    scBetCount: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    scCasinoWins: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    gcCasinoWins: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    gcCasinoBetRollback: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    scCasinoBetRollback: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    gcCasinoWinRollback: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    scCasinoWinRollback: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    gcPurchases: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    scPurchases: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    scRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    gcRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    redeemRejectedAmount: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    redeemCompletedAmount: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    redeemFailedAmount: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    netProfit: {
      allowNull: false,
      type: DataTypes.DOUBLE,
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
