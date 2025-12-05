'use strict'

module.exports = (sequelize, DataTypes) => {
  const City = sequelize.define('City', {
    cityId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    stateId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'city',
    schema: 'public',
    timestamps: true,
    underscored: true
  })
  City.associate = function (models) {
    City.belongsTo(models.State, {
      foreignKey: 'stateId'
    })
  }
  return City
}
