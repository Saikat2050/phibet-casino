'use strict'

module.exports = (sequelize, DataTypes) => {
  const MasterCasinoProvider = sequelize.define('MasterCasinoProvider', {
    masterCasinoProviderId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    thumbnailUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    masterGameAggregatorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    uuid: {
      type: DataTypes.UUID,
      allowNull: true,
      defaultValue: DataTypes.UUIDV4
    }
  },
  {
    sequelize,
    tableName: 'master_casino_providers',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  MasterCasinoProvider.associate = function (models) {
    MasterCasinoProvider.hasMany(models.DailyCumulativeReport, {
      as: 'dailyCumulativeReports',
      foreignKey: 'masterCasinoProviderId',
      onDelete: 'cascade'
    })
    MasterCasinoProvider.hasMany(models.MasterCasinoGame, {
      as: 'casinoGames',
      foreignKey: 'masterCasinoProviderId',
      onDelete: 'cascade'
    })
    MasterCasinoProvider.belongsTo(models.MasterGameAggregator, {
      foreignKey: 'masterGameAggregatorId'
    })
  }

  return MasterCasinoProvider
}
