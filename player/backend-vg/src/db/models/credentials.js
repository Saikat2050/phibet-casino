'use strict'
module.exports = (sequelize, DataTypes) => {
  const Credential = sequelize.define('Credential', {
    credentialId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'credentials',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  Credential.associate = function (models) {
  }
  return Credential
}
