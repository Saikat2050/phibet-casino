'use strict'

module.exports = (sequelize, DataTypes) => {
  const MasterGameCategory = sequelize.define('MasterGameCategory', {
    masterGameCategoryId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  },
  {
    sequelize,
    tableName: 'master_game_categories',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  MasterGameCategory.associate = function (model) {
    MasterGameCategory.hasMany(model.MasterGameSubCategory, {
      foreignKey: 'masterGameCategoryId',
      as: 'masterGameSubCategory'
    })
  }

  return MasterGameCategory
}
