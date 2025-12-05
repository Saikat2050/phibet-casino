import { TOURNAMENT_PRIZE_TYPE } from '@src/utils/constants/casinoTournament.constants'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'
export default class TournamentPrize extends ModelBase {
  static model = 'tournamentPrize'

  static table = 'tournament_prizes'

  static options = {
    name: {
      singular: 'tournament_prize',
      plural: 'tournament_prizes'
    }
  }

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
    tournamentCurrencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    amount: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    type: {
      type: DataTypes.ENUM(Object.values(TOURNAMENT_PRIZE_TYPE)),
      defaultValue: TOURNAMENT_PRIZE_TYPE.NONCASH
    },
    rank: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true
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

  static associate (models) {
    TournamentPrize.belongsTo(models.casinoTournament, { foreignKey: 'tournamentId', onDelete: 'cascade' })
    TournamentPrize.belongsTo(models.tournamentCurrency, { foreignKey: 'tournamentCurrencyId', onDelete: 'cascade' })
    super.associate()
  }
}
