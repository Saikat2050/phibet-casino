'use strict'
module.exports = (sequelize, DataTypes) => {
  const AdminRole = sequelize.define('AdminRole', {
    roleId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    abbr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    level: {
      type: DataTypes.SMALLINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'admin_roles',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  AdminRole.associate = function (models) {
    AdminRole.hasMany(models.AdminUser, {
      foreignKey: 'roleId',
      as: 'adminUser'
    })
  }
  return AdminRole
}
