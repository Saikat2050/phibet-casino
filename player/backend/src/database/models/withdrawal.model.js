import { WITHDRAWAL_STATUS, WITHDRAWAL_TYPES } from '@src/utils/constants/public.constants.utils'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Withdrawal extends ModelBase {
  static model = 'withdrawal'

  static table = 'withdrawals'

  static options = {
    name: {
      singular: 'withdrawal',
      plural: 'withdrawals'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(Object.values(WITHDRAWAL_STATUS)),
      allowNull: false,
      defaultValue: WITHDRAWAL_STATUS.PENDING
    },
    type: {
      type: DataTypes.ENUM(Object.values(WITHDRAWAL_TYPES)),
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    confirmedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    comment: {
      type: DataTypes.STRING
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    failedTransactionId: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }

  static associate (models) {
    Withdrawal.belongsTo(models.user, { foreignKey: 'userId' })
    Withdrawal.hasMany(models.ledger, {
      foreignKey: 'transactionId',
      onDelete: 'cascade',
      scope: {
        transactionType: 'withdrawal'
      }
    })
    super.associate()
  }
}
