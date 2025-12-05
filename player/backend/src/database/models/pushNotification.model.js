import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class PushNotification extends ModelBase {
  static model = 'pushNotification'

  static table = 'push_notifications'

  static options = {
    name: {
      singular: 'push_notification',
      plural: 'push_notifications'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: false
    },
    keys: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: true
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
    PushNotification.belongsTo(models.user, { foreignKey: 'userId' })
    super.associate()
  }
}
