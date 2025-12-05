'use strict'
module.exports = (sequelize, DataTypes) => {
  const UserTournament = sequelize.define(
    'UserTournament',
    {
      userTournamentId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      tournamentId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      userId: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true
      },
      score: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      scWinAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      gcWinAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
        defaultValue: 0
      },
      isCompleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      isWinner: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'user_tournament',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  // define association here:
  UserTournament.associate = function (model) {
    UserTournament.belongsTo(model.User, {
      foreignKey: 'userId'
    })
    UserTournament.belongsTo(model.Tournament, {
      foreignKey: 'tournamentId'
    })
  }

  return UserTournament
}
