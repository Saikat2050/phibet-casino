'use strict'
module.exports = (sequelize, DataTypes) => {
  const WageringTemplate = sequelize.define('WageringTemplate', {
    wageringTemplateId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parentType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gameContribution: {
      type: DataTypes.JSONB
    }
  }, {
    sequelize,
    tableName: 'wagering_templates',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  WageringTemplate.associate = function (models) {
    // WageringTemplate.hasMany(models.Bonus, {
    //   foreignKey: 'wageringTemplateId'
    // })
  }

  return WageringTemplate
}
