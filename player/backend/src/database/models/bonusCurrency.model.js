import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class BonusCurrency extends ModelBase {
  static model = 'bonusCurrency'

  static table = 'bonus_currencies'

  static options = {
    name: {
      singular: 'bonus_currency',
      plural: 'bonus_currencies'
    }
  }

  static indexes = [{
    unique: true,
    fields: ['currency_id', 'bonus_id']
  }]

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    bonusId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    zeroOutThreshold: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 1
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    minDepositAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    minBetAmount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    maxBonusClaimed: {
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

  static associate (models) {
    BonusCurrency.belongsTo(models.bonus, { foreignKey: 'bonusId' })
    BonusCurrency.belongsTo(models.currency, { foreignKey: 'currencyId' })
    super.associate()
  }
}
