import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Notification extends ModelBase {
  static model = 'notification'

  static table = 'notifications'

  static options = {
    name: {
      singular: 'notification',
      plural: 'notifications'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    isPublicNotification: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
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
    Notification.hasMany(models.userNotification, { foreignKey: 'notificationId', onDelete: 'cascade' })
    super.associate()
  }
}
