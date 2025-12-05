import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class AdminActivity extends ModelBase {
  static model = 'adminActivity'

  static table = 'admin_activities'

  static options = {
    name: {
      singular: 'admin_activity',
      plural: 'admin_activities'
    }
  }

  static attributes = {
    id: {
      autoIncrement: true,
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    adminUserId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    entityId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    entityType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    action: {
      type: DataTypes.STRING,
      allowNull: true
    },
    changeTableId: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    changeTableName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    previousData: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    modifiedData: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    service: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category:{
      type: DataTypes.STRING,
      allowNull: false // Set to false if the field should be required
    },
    moreDetails: {
      type: DataTypes.JSONB,
      allowNull: true
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

  static associate (models) {
    AdminActivity.belongsTo(models.adminUser, { foreignKey: 'adminUserId' })
    super.associate()
  }
}
