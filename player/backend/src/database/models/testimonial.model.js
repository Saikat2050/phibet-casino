import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Testimonial extends ModelBase {
  static model = 'testimonial'
  static table = 'testimonials'
  static options = {
    name: {
      singular: 'testimonial',
      plural: 'testimonials'
    }
  }

  static attributes = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      field: 'is_active',
      defaultValue: true
    },
    rating: {
      type: DataTypes.DOUBLE,
      allowNull: false
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
