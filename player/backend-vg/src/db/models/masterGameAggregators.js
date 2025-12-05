'use strict'
module.exports = function (sequelize, DataTypes) {
  const MasterGameAggregator = sequelize.define('MasterGameAggregator', {
    masterGameAggregatorId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    tableName: 'master_game_aggregators',
    schema: 'public',
    timestamps: true,
    underscored: true

  })
  MasterGameAggregator.associate = function (model) {
    MasterGameAggregator.hasMany(model.MasterCasinoProvider, { foreignKey: 'masterGameAggregatorId' })
  }
  return MasterGameAggregator
}
