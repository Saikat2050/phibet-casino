import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class TournamentCurrency extends ModelBase {
  static model = 'tournamentCurrency'

  static table = 'tournament_currencies'

  static options = {
    name: {
      singular: 'tournament_currency',
      plural: 'tournament_currencies'
    }
  }

  static indexes = [{
    unique: true,
    fields: ['currency_id', 'tournament_id']
  }]

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    tournamentId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    entryFees: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: 0.0
    },
    rebuyFees: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    rebuyLimit: {
      type: DataTypes.NUMBER,
      defaultValue: 0
    },
    poolPrize: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    maxPlayerLimit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    minPlayerLimit: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }

  static associate (model) {
    TournamentCurrency.belongsTo(model.casinoTournament, { foreignKey: 'tournamentId' })
    TournamentCurrency.belongsTo(model.currency, { foreignKey: 'currencyId' })
    TournamentCurrency.hasMany(model.tournamentPrize, { foreignKey: 'tournamentCurrencyId' })
    super.associate()
  }
}
