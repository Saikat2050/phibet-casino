import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
import countryCodesToCountries from './countryCodesToCountries.json'

export default class Address extends ModelBase {
  static model = 'address'

  static table = 'addresses'

  static options = {
    name: {
      singular: 'address',
      plural: 'addresses'
    }
  }

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    countryCode: {
      type: DataTypes.ENUM(Object.keys(countryCodesToCountries)),
      allowNull: false
    },
    country: {
      type: DataTypes.VIRTUAL,
      get: () => {
        return countryCodesToCountries[this.countryCode]
      }
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    address2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    stateCode: {
      type: DataTypes.STRING,
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

  static associate (models) {
    Address.belongsTo(models.user, { foreignKey: 'userId' })
    super.associate()
  }
}
