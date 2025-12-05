'use strict'
const { BONUS_TYPE } = require('../../utils/constants/constant')
module.exports = (sequelize, DataTypes) => {
  const Bonus = sequelize.define(
    'Bonus',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      parentType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bonusName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      parentId: {
        type: DataTypes.INTEGER,
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
      promoCode: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
        comment: 'unique slug'
      },
      validFrom: {
        type: DataTypes.DATE,
        allowNull: true
      },
      validTo: {
        type: DataTypes.DATE,
        allowNull: true
      },
      promotionTitle: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      bonusType: {
        type: DataTypes.ENUM(Object.values(BONUS_TYPE)),
        allowNull: false,
        comment: 'deposit- deposit Bonus, freespins- spin bonus'
      },
      termCondition: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      currency: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      wageringMultiplier: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      },
      validOnDays: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      visibleInPromotions: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      claimedCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      description: {
        type: DataTypes.JSONB,
        allowNull: false
      },
      other: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      freeSpinAmount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      gcAmount: {
        type: DataTypes.DOUBLE(10, 2),
        defaultValue: 0.0
      },
      scAmount: {
        type: DataTypes.DOUBLE(10, 2),
        defaultValue: 0.0
      },
      isUnique: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      bonusUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE
      },
      lastActivatedTime: {
        allowNull: true,
        type: DataTypes.DATE,
        defaultValue: new Date()
      },
      percentage: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      minimumPurchase: {
        type: DataTypes.DOUBLE(10, 2),
        field: 'minimum_purchase_amount',
        allowNull: true
      },
      btnText: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'bonus',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )

  Bonus.associate = function (models) {
    // Bonus.belongsTo(models.WageringTemplate, { foreignKey: 'wageringTemplateId' })
    // Bonus.belongsTo(models.PaymentProvider, { foreignKey: 'providerId' })
    Bonus.hasOne(models.UserBonus, { as: 'userBonus', foreignKey: 'bonusId' })
    Bonus.hasMany(models.UserActivities, { foreignKey: 'bonusId' })
  }

  return Bonus
}
