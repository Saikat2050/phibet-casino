'use strict'

module.exports = (sequelize, DataTypes) => {
  const UniqueUserIdentification = sequelize.define('UniqueUserIdentification', {
    UniqueUserIdentificationId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uniqueKey: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'unique_user_identification',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return UniqueUserIdentification
}
