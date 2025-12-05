'use strict'
module.exports = function (sequelize, DataTypes) {
  const DocumentLabel = sequelize.define('DocumentLabel', {
    documentLabelId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    isRequired: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    tableName: 'document_labels',
    schema: 'public',
    timestamps: true,
    underscored: true
  })

  return DocumentLabel
}
