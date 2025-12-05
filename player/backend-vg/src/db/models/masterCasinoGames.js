'use strict'

module.exports = (sequelize, DataTypes) => {
  const MasterCasinoGame = sequelize.define('MasterCasinoGame', {
    masterCasinoGameId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    masterCasinoProviderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isDemoSupported: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    demoUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    brand: {
      allowNull: false,
      type: DataTypes.STRING
    },
    brandId: {
      allowNull: false,
      type: DataTypes.STRING
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    hasFreespins: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    restrictions: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    featureGroup: {
      type: DataTypes.STRING,
      allowNull: true
    },
    devices: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    lines: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    returnToPlayer: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    wageringContribution: {
      type: DataTypes.DOUBLE,
      defaultValue: 100
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    operatorStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'master_casino_games',
    schema: 'public',
    timestamps: true,
    underscored: true

  })

  MasterCasinoGame.associate = function (models) {
    MasterCasinoGame.belongsTo(models.MasterCasinoProvider, {
      foreignKey: 'masterCasinoProviderId'
    })
    MasterCasinoGame.belongsTo(models.MasterGameSubCategory, {
      foreignKey: 'masterGameSubCategoryId'
    })
    MasterCasinoGame.hasMany(models.FavoriteGame, {
      foreignKey: 'masterCasinoGameId'
    })
    MasterCasinoGame.hasMany(models.GameSubcategory, {
      as: 'casinoGames',
      foreignKey: 'masterCasinoGameId'
    })
    MasterCasinoGame.hasMany(models.MasterCasinoGamesThumbnail, {
      foreignKey: 'masterCasinoGameId'
    })
  }

  return MasterCasinoGame
}
