import { USER_BONUS_STATUS_VALUES } from '@src/utils/constants/bonus.constants.utils'
import { DataTypes } from 'sequelize'
import { ModelBase } from '../modelBase'

export class UserBonus extends ModelBase {
  static model = 'userBonus'

  static table = 'user_bonus'

  static options = {
    name: {
      singular: 'user_bonus',
      plural: 'user_bonuses'
    }
  }

  static indexes = [{
    unique: true,
    fields: ['user_id', 'bonus_id']
  }]

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    bonusId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    transactionId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      unique: true
    },
    amountToWager: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    wageredAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM(Object.values(USER_BONUS_STATUS_VALUES)),
      allowNull: false,
      defaultValue: USER_BONUS_STATUS_VALUES.PENDING
    },
    claimedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    issuerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cancelledBy: {
      type: DataTypes.STRING,
      allowNull: true
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
    UserBonus.belongsTo(models.user, { foreignKey: 'userId' })
    UserBonus.belongsTo(models.bonus, { foreignKey: 'bonusId' })
    super.associate()
  }
}
