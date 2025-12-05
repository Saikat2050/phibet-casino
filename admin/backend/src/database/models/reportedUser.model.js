'use strict'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
export default class ReportedUser extends ModelBase {
  static model = 'reportedUser'

  static table = 'reported_users'

  static options = {
    name: {
      singular: 'reported_user',
      plural: 'reported_users'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    actioneeId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reportedUserId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    groupId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'chatGroup',
        key: 'chatGroupId'
      }
    },
    isUnblocked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }

  static associate (models) {
    ReportedUser.belongsTo(models.user, { foreignKey: 'reportedUserId', as: 'reportedUsers' })
    ReportedUser.belongsTo(models.user, { foreignKey: 'actioneeId', as: 'victimUser' })
    super.associate()
  }
}
