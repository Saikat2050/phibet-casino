import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class ChatGroup extends ModelBase {
  static model = 'chatGroup'

  static table = 'chat_groups'

  static options = {
    name: {
      singular: 'chat_group',
      plural: 'chat_groups'
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
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'true'
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    groupLogo: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    admins: {
      type: DataTypes.ARRAY(DataTypes.STRING(255)),
      allowNull: true,
      defaultValue: []
    },
    criteria: {
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: []
    },
    isGlobal: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    users: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    segments: {
      type: DataTypes.JSONB,
      allowNull: true
    },
    bannedUser: {
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
    super.associate()
  }
}
