'use strict'
module.exports = function (sequelize, DataTypes) {
  const GlobalSetting = sequelize.define('GlobalSetting', {
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      primaryKey: true
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'global_settings',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return GlobalSetting
}
