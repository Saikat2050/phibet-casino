import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class CasinoGameCategory extends ModelBase {
  static model = 'casinoGameCategory';

  static table = 'casino_game_categories';

  static attributes = {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    casinoGameId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'casino_games',
        key: 'id'
      }
    },
    casinoCategoryId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'casino_categories',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false
    }
  };

  static associate (models) {
    CasinoGameCategory.belongsTo(models.casinoGame, { foreignKey: 'casinoGameId' })
    CasinoGameCategory.belongsTo(models.casinoCategory, { foreignKey: 'casinoCategoryId' })
    super.associate()
  }
}
