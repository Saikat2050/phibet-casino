'use strict'
module.exports = (sequelize, DataTypes) => {
  const Tournament = sequelize.define(
    'Tournament',
    {
      tournamentId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      entryAmount: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: true
      },
      entryCoin: {
        type: DataTypes.STRING,
        allowNull: false
      },
      startDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      gameId: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: true
      },
      winGc: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      winSc: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      playerLimit: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      winnerPercentage: {
        type: DataTypes.ARRAY(DataTypes.INTEGER),
        allowNull: false,
        field: 'winner_percentages',
        defaultValue: [100]
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'tournament',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  // define association here:
  Tournament.associate = function (model) {
    Tournament.hasMany(model.UserTournament, {
      foreignKey: 'userTournamentId',
      onDelete: 'cascade'
    })
  }

  return Tournament
}
