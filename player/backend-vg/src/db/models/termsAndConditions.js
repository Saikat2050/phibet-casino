'use strict'

module.exports = (sequelize, DataTypes) => {
  const TermsAndConditions = sequelize.define('TermsAndConditions', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    link: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive'),
      allowNull: false,
      defaultValue: 'active'
    },
    actioneeId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'terms_and_conditions',
    underscored: true,
    schema: 'public',
    timestamps: true
  })
  TermsAndConditions.associate = function (models) {
    TermsAndConditions.belongsTo(models.AdminUser, {
      foreignKey: 'actioneeId',
      targetKey: 'adminUserId',
      as: 'admin',
      constraints: false
    })
  }
  return TermsAndConditions
}
