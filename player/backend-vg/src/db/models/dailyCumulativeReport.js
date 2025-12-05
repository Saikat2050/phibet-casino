'use strict'

module.exports = function (sequelize, DataTypes) {
  const DailyCumulativeReport = sequelize.define('DailyCumulativeReport', {
    dailyCumulativeReportId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    masterCasinoProviderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: 0.00
    },
    reportDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'daily_cumulative_report',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  DailyCumulativeReport.associate = function (model) {
    DailyCumulativeReport.belongsTo(model.MasterCasinoProvider, { foreignKey: 'masterCasinoProviderId' })
  }

  return DailyCumulativeReport
}
