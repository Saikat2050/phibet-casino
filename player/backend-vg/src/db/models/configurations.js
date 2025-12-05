'use strict'
module.exports = (sequelize, DataTypes) => {
  const Configuration = sequelize.define('Configuration', {
    ConfigurationId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    allowedCurrencies: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    loyaltyLevel: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    loyaltyPoint: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    allowedLanguages: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    bannerUrl: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'configurations',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  Configuration.associate = function (models) {
  }
  return Configuration
}
