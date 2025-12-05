import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
import { PAGES_CATEGORY } from '@src/utils/constants/public.constants.utils'

export default class Page extends ModelBase {
  static model = 'page'

  static table = 'pages'

  static options = {
    name: {
      singular: 'page',
      plural: 'pages'
    }
  }

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    category: {
      allowNull: true,
      type: DataTypes.ENUM(Object.values(PAGES_CATEGORY))
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
    super.associate()
  }
}
