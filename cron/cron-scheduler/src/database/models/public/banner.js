import { DataTypes } from 'sequelize'
import { ModelBase } from '../modelBase'
import { BANNER_TYPES } from '@src/utils/constants/public.constants.utils'

export class Banner extends ModelBase {
  static model = 'banner'

  static table = 'banners'

  static options = {
    name: {
      singular: 'banner',
      plural: 'banners'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.ENUM(Object.values(BANNER_TYPES)),
      allowNull: false,
      unique: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: ''
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
