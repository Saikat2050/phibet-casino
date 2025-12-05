import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Segmentation extends ModelBase {
  static model = 'segmentation'

  static table = 'segmentation'

  static options = {
    name: {
      singular: 'segmentation',
      plural: 'segmentations'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comments: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    condition: {
      type: DataTypes.JSONB,
      defaultValue: []
    },
    moreDetails: {
      type: DataTypes.JSONB,
      defaultValue: {}
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
