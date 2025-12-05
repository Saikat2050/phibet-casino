'use strict'
module.exports = (sequelize, DataTypes) => {
  const FavoriteGame = sequelize.define('FavoriteGame', {
    favoriteGameId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    masterCasinoGameId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'favorite_games',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  FavoriteGame.associate = function (models) {
    FavoriteGame.belongsTo(models.User, {
      foreignKey: 'userId'
    })
    FavoriteGame.belongsTo(models.MasterCasinoGame, {
      foreignKey: 'masterCasinoGameId'
    })
  }
  return FavoriteGame
}
