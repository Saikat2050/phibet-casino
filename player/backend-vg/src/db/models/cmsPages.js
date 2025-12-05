'use strict'

module.exports = (sequelize, DataTypes) => {
  const CmsPage = sequelize.define('CmsPage', {
    cmsPageId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    title: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    category: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    targetUrl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cmsType: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isHidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'cms_pages',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  CmsPage.associate = function (models) {

  }
  return CmsPage
}
