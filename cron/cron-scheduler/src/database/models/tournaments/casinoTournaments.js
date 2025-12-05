import { DataTypes } from 'sequelize'
import { ModelBase } from '../modelBase'
import { STATUS } from '@src/utils/constants/casinoTournament.constants'

export class CasinoTournament extends ModelBase {
  static model = 'casinoTournament'

  static table = 'casino_tournaments'

  static options = {
    name: {
      singular: 'casino_tournament',
      plural: 'casino_tournaments'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    description: {
      type: DataTypes.JSONB,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    registrationEndDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    creditPoints: {
      type: DataTypes.DOUBLE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(Object.values(STATUS)),
      allowNull: false
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
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

  static associate (model) {
    CasinoTournament.hasMany(model.tournamentPrize, { foreignKey: 'tournamentId' })
    CasinoTournament.hasMany(model.userTournament, { foreignKey: 'tournamentId' })
    CasinoTournament.hasMany(model.tournamentTransaction, { foreignKey: 'tournamentId' })
    CasinoTournament.hasMany(model.casinoTournamentGame, { foreignKey: 'tournamentId' })
    CasinoTournament.hasMany(model.tournamentCurrency, { foreignKey: 'tournamentId' })
    super.associate()
  }
}
