import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class UserActivity extends ModelBase {
  static model = 'userActivity'

  static table = 'user_activity'

  static options = {
    name: {
      singular: 'user_activity',
      plural: 'user_activity'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activityType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
      promocodeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null
    }
  }

  static associate (models) {
    super.associate()
  }
}
