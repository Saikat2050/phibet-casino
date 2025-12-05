'use strict'
module.exports = function (sequelize, DataTypes) {
  const PageContent = sequelize.define('PageContent', {
    pageId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    pageName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    seoDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 'Value will be an object containing SEO title, description and keywords'
    },
    assets: {
      type: DataTypes.JSONB,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'page_content',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  return PageContent
}
