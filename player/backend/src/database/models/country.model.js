import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
import countryCodesToCountries from './countryCodesToCountries.json'

export default class Country extends ModelBase {
  static model = 'country'

  static table = 'countries'

  static options = {
    name: {
      singular: 'country',
      plural: 'countries'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.ENUM(Object.keys(countryCodesToCountries)),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    languageId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
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
    Country.belongsTo(models.language, { foreignKey: 'languageId' })
    Country.hasMany(models.user, { foreignKey: 'countryId', onDelete: 'cascade' })
    super.associate()
  }
}
