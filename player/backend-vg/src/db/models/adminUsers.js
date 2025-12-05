'use strict'

module.exports = (sequelize, DataTypes) => {
  const AdminUser = sequelize.define('AdminUser', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lastName: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phoneVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    adminRoleId: {
      type: DataTypes.INTEGER
    },
    parentAdminId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    siteLayout: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: DEFAULT_SITE_LAYOUT
    }
  }, {
    sequelize,
    tableName: 'admin_users',
    modelName: 'AdminUser',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  AdminUser.associate = function (models) {
    AdminUser.belongsTo(models.AdminRole, {
      foreignKey: 'adminRoleId'
    })
    AdminUser.hasMany(models.TermsAndConditions, {
      foreignKey: 'actioneeId',
      sourceKey: 'id',
      constraints: false,
      as: 'admin'
    })
  }
  return AdminUser
}
