import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class SeoPages extends ModelBase {
  static model = 'seoPages'

  static table = 'seo_pages'

  static options = {
    name: {
      singular: 'seo_page',
      plural: 'seo_pages'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    noIndex: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    canonicalUrl: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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
}
