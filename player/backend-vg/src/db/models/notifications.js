'use strict'

module.exports = function (sequelize, DataTypes) {
  const Notification = sequelize.define('Notification', {
    notificationId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    senderType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    senderId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    referenceType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'For Withdrawal request, deposit etc'
    },
    referenceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notificationMessage: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'notifications',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  Notification.associate = function (model) {
    Notification.hasMany(model.NotificationReceiver, {
      as: 'notificationReceivers',
      foreignKey: 'notificationId',
      onDelete: 'cascade'
    })
  }

  return Notification
}
