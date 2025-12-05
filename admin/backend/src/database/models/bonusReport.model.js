import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class BonusReport extends ModelBase {
  static model = 'BonusReport'

  static table = 'bonus_report'
  static options = {
    name: {
      singular: 'bonus_report',
      plural: 'bonus_reports'
    }
  }

  static attributes = {
    id: {
      allowNull: false,
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    vipTierMonthlyBonusCount: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    vipTierMonthlyBonusGCRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    vipTierMonthlyBonusSCRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    vipTierWeeklyBonusCount: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    vipTierWeeklyBonusGCRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    vipTierWeeklyBonusSCRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    purchaseBonusCount: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    purchaseBonusSCRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    spinWheelBonusCount: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    spinWheelBonusGCRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    spinWheelBonusSCRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    joiningBonusCount: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    joiningBonusGCRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    joiningBonusSCRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    dailyBonusCount: {
      allowNull: false,
      type: DataTypes.BIGINT,
      defaultValue: 0
    },
    dailyBonusGCRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    dailyBonusSCRewards: {
      allowNull: false,
      type: DataTypes.DOUBLE,
      defaultValue: 0.0
    },
    playerRegisterCount: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0
    },
    isInternal: {
      allowNull: true,
      type: DataTypes.BOOLEAN
    },
    fromDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    toDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }
}
