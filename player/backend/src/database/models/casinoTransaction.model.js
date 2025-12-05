import { CASINO_TRANSACTION_STATUS } from '@src/utils/constants/casinoManagement.constants.js'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class CasinoTransaction extends ModelBase {
  static model = 'casinoTransaction'

  static table = 'casino_transactions'

  static options = {
    name: {
      singular: 'casino_transaction',
      plural: 'casino_transactions'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    transactionId: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gameId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    roundId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    metaData: {
      type: DataTypes.JSONB
    },
    status: {
      type: DataTypes.ENUM(Object.values(CASINO_TRANSACTION_STATUS)),
      allowNull: false,
      defaultValue: CASINO_TRANSACTION_STATUS.PENDING
    },
    previousTransactionId: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      unique: true
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
    CasinoTransaction.belongsTo(models.casinoGame, { foreignKey: 'gameId' })
    CasinoTransaction.belongsTo(models.user, { foreignKey: 'userId' })
    CasinoTransaction.hasMany(models.ledger, {
      foreignKey: 'transactionId',
      as: 'casinoLedger',
      onDelete: 'cascade',
      scope: {
        transaction_type: 'casino'
      }
    })

    super.associate()
  }
}
