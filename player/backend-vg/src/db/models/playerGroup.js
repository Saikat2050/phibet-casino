'use strict'

module.exports = (sequelize, DataTypes) => {
  const PlayerGroup = sequelize.define('PlayerGroup', {
    groupId: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'group_id'
    },
    groupName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'group_name'
    },
    userIds: {
      type: DataTypes.JSONB,
      allowNull: false,
      field: 'user_ids'
    }
  }, {
    sequelize,
    tableName: 'player_groups',
    modelName: 'PlayerGroup',
    schema: 'public',
    timestamps: true
  })

  return PlayerGroup
}
