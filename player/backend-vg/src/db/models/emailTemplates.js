'use strict'

const { EMAIL_TEMPLATE_PRIMARY_STATUS } = require('../../utils/constants/constant')

module.exports = function (sequelize, DataTypes) {
  const EmailTemplate = sequelize.define('EmailTemplate', {
    emailTemplateId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    adminId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isPrimary: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: EMAIL_TEMPLATE_PRIMARY_STATUS.DISABLE
    },
    dynamicData: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    templateCode: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'email_templates',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return EmailTemplate
}
