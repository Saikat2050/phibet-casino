'use strict'

const { RESPONSIBLE_GAMBLING_LIMIT, RESPONSIBLE_GAMBLING_STATUS, RESPONSIBLE_GAMBLING_TYPE } = require('../../utils/constants/constant')

module.exports = (sequelize, DataTypes) => {
  const ResponsibleGambling = sequelize.define('ResponsibleGambling', {
    responsibleGamblingId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sessionReminderTime: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Selected session reminder interval in hours'
    },
    status: {
      type: DataTypes.ENUM(Object.values(RESPONSIBLE_GAMBLING_STATUS)),
      allowNull: false,
      comment: 'active:1, in-active:0, cooling-period:2'
    },
    limitType: {
      type: DataTypes.ENUM(Object.values(RESPONSIBLE_GAMBLING_LIMIT)),
      allowNull: true,
      comment: 'daily-1, weekly:2, monthly:3'
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      comment: 'daily-1, weekly:2, monthly:3'
    },
    timeBreakDuration: {
      type: DataTypes.DATE,
      allowNull: true
    },
    selfExclusion: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    responsibleGamblingType: {
      type: DataTypes.ENUM(Object.values(RESPONSIBLE_GAMBLING_TYPE)),
      allowNull: true,
      comment: 'bet:1, purchase:2, time:3, time_break:4, self_exclusion:5'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: 'users',
          schema: 'public'
        },
        key: 'user_id'
      }
    },
    lastActiveTime: {
      type: DataTypes.DATE,
      allowNull: true
    },
    totalTime: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isRemoved: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    permanentSelfExcluded: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    depositAmount: {
      allowNull: true,
      type: DataTypes.DOUBLE
    }
  }, {
    sequelize,
    tableName: 'responsible_gambling',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  ResponsibleGambling.associate = function (models) {
    ResponsibleGambling.belongsTo(models.User, {
      foreignKey: 'user_id',
      constraints: false
    })
  }

  return ResponsibleGambling
}
