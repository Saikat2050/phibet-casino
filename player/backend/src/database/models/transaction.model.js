import { TRANSACTION_STATUS } from '@src/utils/constants/public.constants.utils'
import { DataTypes, Op } from 'sequelize'
import ModelBase from './modelBase.model'

export default class Transaction extends ModelBase {
  static model = 'transaction'

  static table = 'transactions'

  static options = {
    name: {
      singular: 'transaction',
      plural: 'transactions'
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
    status: {
      type: DataTypes.ENUM(Object.values(TRANSACTION_STATUS)),
      allowNull: false,
      defaultValue: TRANSACTION_STATUS.PENDING
    },
    paymentId: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'order Id'
    },
    paymentProviderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    packageId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actioneeId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    }
  }

  static associate (models) {
    Transaction.belongsTo(models.user, { foreignKey: 'userId' })
    Transaction.hasMany(models.ledger, {
      foreignKey: 'transactionId',
      as: 'transactionLedger',
      onDelete: 'CASCADE',
      scope: {
        transaction_type: {
          [Op.ne]: 'casino'
        }
      }
    })

    Transaction.belongsTo(models.adminUser, { foreignKey: 'actioneeId' })
    Transaction.belongsTo(models.paymentProvider, { foreignKey: 'paymentProviderId' })
    Transaction.belongsTo(models.package, { foreignKey: 'packageId' })
    Transaction.belongsTo(models.ledger, { foreignKey: 'id' })
    Transaction.hasOne(models.userBonus, { foreignKey: 'transactionId' })
    super.associate()
  }
}
