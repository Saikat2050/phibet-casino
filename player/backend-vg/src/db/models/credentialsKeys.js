'use strict'
module.exports = function (sequelize, DataTypes) {
  const CredentialsKey = sequelize.define('CredentialsKey', {
    credentialKeyId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'credentials_keys',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  CredentialsKey.associate = function (models) {
    // associations can be defined here
  }
  return CredentialsKey
}
