import { DataTypes } from 'sequelize'
import { ModelBase } from '../modelBase'

export class UserTournament extends ModelBase {
  static model = 'userTournament'

  static table = 'user_tournaments'

  static options = {
    name: {
      singular: 'user_tournament',
      plural: 'user_tournaments'
    }
  }

  static indexes = [{
    unique: true,
    fields: ['user_id', 'tournament_id']
  }]

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    tournamentId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    currencyId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    points: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    winPoints: {
      type: DataTypes.DOUBLE,
      defaultValue: 0
    },
    amountSpent: {
      type: DataTypes.DOUBLE,
      allowNull: true
    },
    rebuyLimit: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    winPrize: {
      type: DataTypes.DOUBLE,
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
    UserTournament.belongsTo(models.casinoTournament, { foreignKey: 'tournamentId', onDelete: 'cascade' })
    UserTournament.belongsTo(models.casinoTournament, { foreignKey: 'currencyId', onDelete: 'cascade' })
    UserTournament.belongsTo(models.user, { foreignKey: 'userId', onDelete: 'cascade' })
    super.associate()
  }
}
