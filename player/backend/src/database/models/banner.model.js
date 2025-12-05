import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
import { BANNER_TYPES } from '@src/utils/constants/public.constants.utils'

export default class Banner extends ModelBase {
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
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    mobileImageUrl: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
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
    this.hasMany(models.bannerItem, { foreignKey: 'bannerId', as: 'items', onDelete: 'CASCADE' })
    super.associate()
  }
}
