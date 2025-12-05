import { DataTypes } from 'sequelize'
import ModelBase from './modelBase.model'

export default class ChatInvitation extends ModelBase {
  static model = 'chatInvitation'

  static table = 'chat_invitations'

  static options = {
    name: {
      singular: 'chat_invitation',
      plural: 'chat_invitations'
    }
  }

  static attributes = {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    invitationType: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'invitation_type'
    },
    requestStatus: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'request_status'
    },
    receiver: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    sender: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    groupId: {
      type: DataTypes.BIGINT,
      allowNull: true,
      field: 'group_id'
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }

  static associate (models) {
    super.associate()
    this.belongsTo(models.user, {
      foreignKey: 'receiver',
      as: 'receiverUser'
    })
    this.belongsTo(models.user, {
      foreignKey: 'sender',
      as: 'senderUser'
    })
    this.belongsTo(models.chatGroup, {
      foreignKey: 'groupId',
      as: 'group'
    })
  }
}
