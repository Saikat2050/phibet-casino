'use strict'

module.exports = (sequelize, DataTypes) => {
  const Country = sequelize.define('Country', {
    countryId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    restrictedProviders: {
      type: DataTypes.JSONB
    },
    restrictedGames: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    tableName: 'countries',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return Country
}
