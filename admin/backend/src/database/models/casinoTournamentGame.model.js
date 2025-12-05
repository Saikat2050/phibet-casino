import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class CasinoTournamentGame extends ModelBase {
  static model = 'casinoTournamentGame'

  static table = 'casino_tournament_games'

  static options = {
    name: {
      singular: 'casino_tournament_game',
      plural: 'casino_tournament_games'
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
    casinoGameId: {
      type: DataTypes.BIGINT,
      allowNull: false
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
    CasinoTournamentGame.belongsTo(models.casinoTournament, { foreignKey: 'tournamentId', onDelete: 'cascade' })
    CasinoTournamentGame.belongsTo(models.casinoGame, { foreignKey: 'casinoGameId', onDelete: 'cascade' })
    super.associate()
  }
}
