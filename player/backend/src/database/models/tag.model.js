import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Tag extends ModelBase {
  static model = 'tag'

  static table = 'tags'

  static options = {
    name: {
      singular: 'tag',
      plural: 'tags'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tag: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
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
    Tag.hasMany(models.userTag, { foreignKey: 'tagId' })
    super.associate()
  }
}
