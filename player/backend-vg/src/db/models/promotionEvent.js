'use strict'

const { PROMOTION_EVENT_STATUS } = require('../../utils/constants/constant')

module.exports = (sequelize, DataTypes) => {
  const PromotionCode = sequelize.define(
    'PromotionCode',
    {
      promocodeId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      promocode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      affiliateId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      bonusGc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      bonusSc: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      validTill: {
        type: DataTypes.DATE,
        allowNull: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: PROMOTION_EVENT_STATUS.PROMO_CREATED
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      availedAt: {
        type: DataTypes.DATE,
        allowNull: true
      },
      maxUses: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null
      },
      useCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      sequelize,
      tableName: 'promotion_codes',
      schema: 'public',
      paranoid: true,
      timestamps: true,
      underscored: true
    }
  )

  // define association here:
  PromotionCode.associate = function (model) {
    PromotionCode.belongsTo(model.User, {
      foreignKey: 'userId',
      targetKey: 'userId'
    })
    PromotionCode.hasMany(model.UserBonus, {
      foreignKey: 'promocodeId'
    })
  }

  return PromotionCode
}
