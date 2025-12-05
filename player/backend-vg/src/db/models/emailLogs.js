'use strict'

module.exports = (sequelize, DataTypes) => {
  const EmailLog = sequelize.define('EmailLog', {
    emailLogId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    emailTemplateId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    emailTemplateName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    messageId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    source: {
      type: DataTypes.STRING,
      allowNull: true
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null
    }
  },
  {
    sequelize,
    tableName: 'email_logs',
    schema: 'public',
    timestamps: true,
    underscored: true

  })

  return EmailLog
}
