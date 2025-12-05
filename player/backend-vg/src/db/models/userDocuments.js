'use strict'

module.exports = function (sequelize, DataTypes) {
  const UserDocument = sequelize.define('UserDocument', {
    userDocumentId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    documentUrl: {
      type: DataTypes.JSONB,
      allowNull: true,
      comment: 's3 urls'
    },
    documentName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    status: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 0,
      comment: '0- pending, 1-approved, 2-rejected, 3-cancelled, 4-reRequested'
    },
    actionee: {
      type: DataTypes.STRING,
      allowNull: true
    },
    actionPerformedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'reason for rejection if rejected'
    }
  }, {
    sequelize,
    tableName: 'user_documents',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  UserDocument.associate = function (model) {
    UserDocument.belongsTo(model.User, { foreignKey: 'userId' })
  }

  return UserDocument
}
