'use strict'

const { BONUS_TYPE, BONUS_STATUS } = require('../../utils/constants/constant')

module.exports = (sequelize, DataTypes) => {
  const UserBonus = sequelize.define('UserBonus', {
    userBonusId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    bonusId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bonusType: {
      type: DataTypes.ENUM(Object.values(BONUS_TYPE)),
      allowNull: false
    },
    bonusParentId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    day: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    progressInDay: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    freeSpinsQty: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bonusAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    amountToWager: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    wageredAmount: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    wageringStatus: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: BONUS_STATUS.PENDING
    },
    transactionId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: BONUS_STATUS.PENDING
    },
    claimedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: new Date(),
      comment: 'date of issuing bonus to player, or when player claims any bonus'
    },
    expireAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    issuerRole: {
      type: DataTypes.STRING,
      allowNull: true
    },
    issuerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    games: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    uniqueId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    cashAmount: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    amountConverted: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: 0
    },
    betLevel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    primaryCurrencyAmount: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    cancelledBy: {
      type: DataTypes.STRING,
      allowNull: true
    },
    freeSpinAmount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    gcAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    scAmount: {
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    promocodeId: {
      type: DataTypes.INTEGER,
      defaultValue: null
    }
  }, {
    sequelize,
    tableName: 'user_bonus',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  UserBonus.associate = function (models) {
    UserBonus.belongsTo(models.User, { foreignKey: 'userId' })
    UserBonus.belongsTo(models.Bonus, { foreignKey: 'bonusId', as: 'bonus' })
    UserBonus.belongsTo(models.PromotionCode, { foreignKey: 'promocodeId' })
  }

  return UserBonus
}
