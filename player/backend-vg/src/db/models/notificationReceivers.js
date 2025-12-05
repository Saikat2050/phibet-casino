'use strict'

module.exports = function (sequelize, DataTypes) {
  const NotificationReceiver = sequelize.define('NotificationReceiver', {
    notificationReceiverId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    receiverType: {
      type: DataTypes.STRING,
      allowNull: false,
      comment: 'user adminUser'
    },
    receiverId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    notificationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'notification_receivers',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  NotificationReceiver.associate = function (models) {
    NotificationReceiver.belongsTo(models.Notification, { foreignKey: 'public' })
  }

  return NotificationReceiver
}
