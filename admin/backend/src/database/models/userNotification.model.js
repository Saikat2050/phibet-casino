import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class UserNotification extends ModelBase {
  static model = 'userNotification'

  static table = 'user_notification'

  static options = {
    name: {
      singular: 'user_notification',
      plural: 'user_notifications'
    }
  }

  static indexes = [{
    unique: true,
    fields: ['notification_id']
  }]

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    notificationId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }

  static associate (models) {
    UserNotification.belongsTo(models.user, { foreignKey: 'userId' })
    UserNotification.belongsTo(models.notification, { foreignKey: 'notificationId' })
    super.associate()
  }
}
