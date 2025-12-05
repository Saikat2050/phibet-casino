'use strict'

module.exports = (sequelize, DataTypes) => {
  const MasterGameSubCategory = sequelize.define('MasterGameSubCategory', {
    masterGameSubCategoryId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    masterGameCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    thumbnailType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isFeatured: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'master_game_sub_categories',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  MasterGameSubCategory.associate = function (model) {
    MasterGameSubCategory.belongsTo(model.MasterGameCategory, {
      foreignKey: 'masterGameCategoryId'
    })
    MasterGameSubCategory.hasMany(model.MasterCasinoGame, {
      foreignKey: 'masterGameSubCategoryId'
    })
    MasterGameSubCategory.hasMany(model.GameSubcategory, {
      foreignKey: 'masterGameSubCategoryId'
    })
  }

  return MasterGameSubCategory
}
