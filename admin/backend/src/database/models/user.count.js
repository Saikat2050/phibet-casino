import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class UserActivity extends ModelBase {
  static model = 'playerCount'

  static table = 'player_count'

  static options = {
    name: {
      singular: 'player_count',
      plural: 'player_counts'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    count: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
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
    super.associate()
  }
}
