'use strict'

module.exports = (sequelize, DataTypes) => {
  const PromoCodeUser = sequelize.define(
    'PromoCodeUser',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      promoCodeId: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      tableName: 'promo_code_users',
      schema: 'public',
      underscored: true,
      timestamps: true
    }
  )

  PromoCodeUser.associate = function (models) {
    PromoCodeUser.belongsTo(models.Promocode, {
      foreignKey: 'promo_code_id',
      as: 'promocode'
    })

    PromoCodeUser.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    })
  }

  return PromoCodeUser
}
