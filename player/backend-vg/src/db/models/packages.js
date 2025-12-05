'use strict'

module.exports = function (sequelize, DataTypes) {
  const Package = sequelize.define('Package', {
    packageId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    previousAmount: {
      type: DataTypes.DOUBLE,
      allowNull: true,
      defaultValue: 0.0
    },
    gcCoin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    scCoin: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    isVisibleInStore: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    validTill: {
      type: DataTypes.DATE,
      allowNull: true
    },
    firstPurchaseApplicable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'first_purchase_bonus_applicable'
    },
    firstPurchaseScBonus: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true,
      defaultValue: 0.0
    },
    firstPurchaseGcBonus: {
      type: DataTypes.DOUBLE(10, 2),
      allowNull: true,
      defaultValue: 0.0
    },
    purchaseLimitPerUser: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    welcomePurchaseBonusApplicable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    welcomePurchaseBonusApplicableMinutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    welcomePurchasePercentage: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: 'package description'
    },
    validFrom: {
      type: DataTypes.DATE,
      allowNull: true
    },
    bonusSc: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    bonusGc: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 0
    },
    playerId: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    isSpecialPackage: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    isHighlighted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'package',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  Package.associate = function (models) {
    Package.hasMany(models.TransactionBanking, { foreignKey: 'packageId' })
  }
  return Package
}
