'use strict'
import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class FraudLog extends ModelBase {
  static model = 'fraudLog'

  static table = 'fraud_log'

  static options = {
    name: {
      singular: 'fraud_log',
      plural: 'fraud_logs'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true
    },
    seonId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'seon_id'
    },
    fraudScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'fraud_score'
    },
    appliedRules: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'applied_rules'
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true,
      field: 'more_details'
    },
    userId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'updated_at'
    }
  }

  static associate (models) {
    FraudLog.belongsTo(models.user, { foreignKey: 'userId' })
    super.associate()
  }
}
