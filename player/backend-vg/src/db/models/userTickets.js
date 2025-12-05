'use strict'

import { TICKET_STATUS, TICKET_TYPE } from '../../utils/constants/constant'

module.exports = (sequelize, DataTypes) => {
  const UserTickets = sequelize.define('UserTickets', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    playerAction: {
      type: DataTypes.STRING,
      allowNull: false
    },
    playerActionTime: {
      type: DataTypes.DATE,
      allowNull: false
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    assignTo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM(Object.values(TICKET_STATUS)),
      allowNull: true
    },
    resolve: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    ticketType: {
      type: DataTypes.ENUM(Object.values(TICKET_TYPE)),
      allowNull: true
    },
    assignedOn: {
      type: DataTypes.DATE,
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    resolvedIn: {
      type: DataTypes.BIGINT,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'user_tickets',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  UserTickets.associate = function (models) {
    UserTickets.belongsTo(models.AdminUser, {
      foreignKey: 'assignTo',
      targetKey: 'adminUserId',
      as: 'admin',
      constraints: false
    })
    UserTickets.belongsTo(models.User, {
      foreignKey: 'playerId',
      targetKey: 'userId',
      as: 'user',
      constraints: false
    })
  }

  return UserTickets
}
