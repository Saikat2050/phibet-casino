import { DataTypes } from 'sequelize'
import { ModelBase } from '../modelBase'

export default class PerformanceReport extends ModelBase {
    static model = 'PerformanceReport'

    static table = 'performance_report'
    static options = {
      name: {
        singular: 'performance_report',
        plural: 'performance_reports'
      }
    }

    static attributes = {
      id: {
        allowNull: false,
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      purchaseCount: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      purchaseAmount: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      purchaseGcAmount: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      pscAmount: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      bonusGcAmount: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      bonusBscAmount: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      gcTotalBetAmount: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      gcTotalWinAmount: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      scTotalBetAmount: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      scTotalWinAmount: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      pendingRedeemRequestAmount: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      pendingRedeemRequestCount: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      failedRedeemRequestCount: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      failedRedeemRequestAmount: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      successRedeemRequestCount: {
        allowNull: true,
        type: DataTypes.INTEGER
      },
      successRedeemRequestAmount: {
        allowNull: true,
        type: DataTypes.FLOAT
      },
      fromDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      toDate: {
        type: DataTypes.DATE,
        allowNull: false
      },
      firstPurchaseCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
      },
      firstPurchaseAmount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0.0
      },
      playerRegisterCount: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
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
