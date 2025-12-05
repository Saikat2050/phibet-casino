'use strict'
const { THUMBNAIL_TYPE } = require('../../utils/constants/constant')

module.exports = (sequelize, DataTypes) => {
  const MasterCasinoGamesThumbnail = sequelize.define('MasterCasinoGamesThumbnail', {
    thumbnailId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    masterCasinoGameId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    thumbnailType: {
      type: DataTypes.ENUM(Object.values(THUMBNAIL_TYPE)),
      allowNull: false
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'master_casino_games_thumbnail',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  return MasterCasinoGamesThumbnail
}
