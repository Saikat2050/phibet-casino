import { DataTypes } from 'sequelize'
import { ModelBase } from '../modelBase'
import { TRANSACTION_PURPOSE, TRANSACTION_TYPE } from '@src/utils/constants/casinoTournament.constants'

export class TournamentTransaction extends ModelBase {
  static model = 'tournamentTransaction'

  static table = 'tournament_transactions'

  static options = {
    name: {
      singular: 'tournament_transaction',
      plural: 'tournament_transactions'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    transactionId: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      unique: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    tournamentId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    casinoGameId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM(Object.values(TRANSACTION_TYPE)),
      allowNull: false
    },
    purpose: {
      type: DataTypes.ENUM(Object.values(TRANSACTION_PURPOSE)),
      allowNull: false
    },
    points: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
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
    TournamentTransaction.belongsTo(models.casinoGame, { foreignKey: 'casinoGameId' })
    TournamentTransaction.belongsTo(models.user, { foreignKey: 'userId' })
    TournamentTransaction.belongsTo(models.casinoTournament, { foreignKey: 'tournamentId' })
    TournamentTransaction.belongsTo(models.currency, { foreignKey: 'currencyId' })
    super.associate()
  }
}
