'use strict'
const { BONUS_STATUS } = require('../../utils/constants/constant')
module.exports = (sequelize, DataTypes) => {
  const PersonalBonus = sequelize.define(
    'PersonalBonus',
    {
      bonusId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      bonusCode: {
        type: DataTypes.STRING,
        allowNull: false
      },
      amount: {
        type: DataTypes.DOUBLE(10, 2),
        defaultValue: 0.0
      },
      coinType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      claimedBy: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: BONUS_STATUS.PENDING
      },
      claimedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        comment:
          'date of issuing bonus to player, or when player claims personal bonus'
      }
    },
    {
      sequelize,
      tableName: 'personal_bonus',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  PersonalBonus.associate = function (models) {
    PersonalBonus.belongsTo(models.User, {
      foreignKey: 'createdBy',
      targetKey: 'userId',
      as: 'createdUser'
    })
    PersonalBonus.belongsTo(models.User, {
      foreignKey: 'claimedBy',
      targetKey: 'userId',
      as: 'claimedUser'
    })
  }

  return PersonalBonus
}
