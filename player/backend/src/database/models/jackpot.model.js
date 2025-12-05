'use strict'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Jackpot extends ModelBase {
  static model = 'jackpot'
  static table = 'jackpots'

  static options = {
    name: {
      singular: 'jackpot',
      plural: 'jackpots'
    },
    schema: 'public',
    timestamps: true,
    underscored: true,
    paranoid: true
  }

  static attributes = {
    jackpotId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    jackpotName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    maxTicketSize: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    seedAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    jackpotPoolAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    jackpotPoolEarning: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0
    },
    entryAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    adminShare: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    poolShare: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    winningTicket: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      comment: '0: Upcoming, 1: Active, 2: Closed'
    },
    gameId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'start_date'
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'end_date'
    },
    deletedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'deleted_at'
    },
    ticketSold: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      field: 'ticket_sold'
    }
  }

  static associate (models) {
    Jackpot.belongsTo(models.casinoGame, {
      foreignKey: 'gameId',
      targetKey: 'id'
    })
    super.associate()
  }
}
