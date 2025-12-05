import { CURRENCY_TYPES } from '@src/utils/constants/public.constants.utils'
import { DataTypes } from 'sequelize'
import { ModelBase } from '../modelBase'

export class Currency extends ModelBase {
  static model = 'currency'

  static table = 'currencies'

  static options = {
    name: {
      singular: 'currency',
      plural: 'currencies'
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
    code: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    exchangeRate: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 1
    },
    type: {
      type: DataTypes.ENUM(Object.values(CURRENCY_TYPES)),
      allowNull: false,
      defaultValue: CURRENCY_TYPES.FIAT
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    symbol: {
      type: DataTypes.STRING(255),
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

  static associate (models) {
    Currency.hasMany(models.wallet, { foreignKey: 'currencyId', onDelete: 'cascade' })
    Currency.hasMany(models.ledger, { foreignKey: 'currencyId', onDelete: 'cascade' })
    super.associate()
  }
}
