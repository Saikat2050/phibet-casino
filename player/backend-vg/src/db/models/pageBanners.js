'use strict'
module.exports = (sequelize, DataTypes) => {
  const PageBanner = sequelize.define(
    'PageBanner',
    {
      pageBannerId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      visibility: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
      desktopImageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      mobileImageUrl: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      btnText: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      btnRedirection: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      pageName: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      textOne: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      textTwo: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      textThree: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: true
      },
      isCountDown: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'page_banners',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )
  PageBanner.associate = function (models) {
    // associations can be defined here
  }
  return PageBanner
}
