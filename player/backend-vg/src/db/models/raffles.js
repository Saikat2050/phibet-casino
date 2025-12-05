'use strict'
module.exports = (sequelize, DataTypes) => {
  const Raffles = sequelize.define(
    'Raffles',
    {
      raffleId: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: true
      },
      subHeading: {
        type: DataTypes.STRING,
        allowNull: true
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      wagerBaseAmt: {
        type: DataTypes.DOUBLE(10, 2),
        allowNull: false,
        comment: 'player must be wager at least 500 SC'
      },
      wagerBaseAmtType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'SC'
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
      prizeAmountGc: {
        type: DataTypes.DOUBLE(10, 2),
        defaultValue: 0.0
      },
      prizeAmountSc: {
        type: DataTypes.DOUBLE(10, 2),
        defaultValue: 0.0
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      winnerId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      winnerTicketId: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      status: {
        type: DataTypes.STRING,
        allowNull: true
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      wonDate: {
        type: DataTypes.DATE,
        allowNull: true
      },
      moreDetails: {
        type: DataTypes.JSONB,
        allowNull: true
      },
      termsAndConditions: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      tableName: 'raffles',
      schema: 'public',
      timestamps: true,
      underscored: true
    }
  )

  // define association here:
  Raffles.associate = function (model) {
    Raffles.hasMany(model.RafflesEntry, {
      as: 'entries',
      foreignKey: 'raffleId',
      onDelete: 'cascade'
    })

    Raffles.belongsTo(model.User, {
      foreignKey: 'winnerId',
      targetKey: 'userId',
      as: 'winner'
    })
  }

  return Raffles
}
