import { LEDGER_TRANSACTION_TYPE, LEDGER_PURPOSE } from '@src/utils/constants/public.constants.utils'
import { DataTypes } from 'sequelize'
import { ModelBase } from '../modelBase'

export class Ledger extends ModelBase {
  static model = 'ledger'

  static table = 'ledgers'

  static options = {
    name: {
      singular: 'ledger',
      plural: 'ledgers'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    purpose: {
      type: DataTypes.ENUM(Object.values(LEDGER_PURPOSE)),
      allowNull: false
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    toWalletId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    fromWalletId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    transactionId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    transactionType: {
      type: DataTypes.ENUM(Object.values(LEDGER_TRANSACTION_TYPE)),
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
    // Wallet associations
    Ledger.belongsTo(models.wallet, { foreignKey: 'toWalletId', as: 'toWallet' })
    Ledger.belongsTo(models.wallet, { foreignKey: 'fromWalletId', as: 'fromWallet' })

    // Currency association
    Ledger.belongsTo(models.currency, { foreignKey: 'currencyId' })

    // Polymorphic associations
    Ledger.belongsTo(models.withdrawal, { foreignKey: 'transactionId', constraints: false, as: 'withdrawalLedger' })
    Ledger.belongsTo(models.transaction, { foreignKey: 'transactionId', constraints: false, as: 'transactionLedger' })
    Ledger.belongsTo(models.casinoTransaction, { foreignKey: 'transactionId', constraints: false, as: 'casinoLedger' })

    super.associate()
  }
}
