'use strict'
module.exports = function (sequelize, DataTypes) {
  const GameSubcategory = sequelize.define('GameSubcategory', {
    gameSubcategoryId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    masterCasinoGameId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    masterGameSubCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'game_subcategory',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  GameSubcategory.associate = function (model) {
    GameSubcategory.belongsTo(model.MasterCasinoGame, {
      as: 'casinoGames',
      foreignKey: 'masterCasinoGameId'
    })
    GameSubcategory.belongsTo(model.MasterGameSubCategory, {
      foreignKey: 'masterGameSubCategoryId'
    })
  }
  return GameSubcategory
}
