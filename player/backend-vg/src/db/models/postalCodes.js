'use strict'
import { POSTAL_CODE_STATUS } from '../../utils/constants/constant'

module.exports = function (sequelize, DataTypes) {
  const PostalCode = sequelize.define('PostalCode', {
    postalCodeId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isClaimed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    validTo: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: POSTAL_CODE_STATUS.PENDING
    }
  }, {
    sequelize,
    tableName: 'postal_codes',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  PostalCode.associate = function (model) {
    PostalCode.belongsTo(model.User, {
      foreignKey: 'userId',
      constraints: false
    })
  }

  return PostalCode
}
