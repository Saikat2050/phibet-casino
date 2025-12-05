'use strict'

module.exports = (sequelize, DataTypes) => {
  const Promocode = sequelize.define(
    'Promocode',
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
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      validTill: {
        type: DataTypes.DATE,
        allowNull: true
      },
      maxUsersAvailed: {
        type: DataTypes.BIGINT,
        allowNull: true,
        defaultValue: null
      },
      perUserLimit: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      isDiscountOnAmount: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      discountPercentage: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0
      },
      package: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
      },
      isPromoCodeForAllUsers: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    },
    {
      sequelize,
      tableName: 'promo_codes',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true
    }
  )

  // define association here:
  Promocode.associate = function (models) {
    Promocode.hasMany(models.PromoCodeUser, {
      foreignKey: 'promo_code_id',
      as: 'user',
      onDelete: 'CASCADE'
    })
  }

  return Promocode
}
