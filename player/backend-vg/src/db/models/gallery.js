'use strict'

module.exports = (sequelize, DataTypes) => {
  const Gallery = sequelize.define('Gallery', {
    imageId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false
    }
  },
  {
    sequelize,
    tableName: 'gallery',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  Gallery.associate = function (model) {
  }

  return Gallery
}
