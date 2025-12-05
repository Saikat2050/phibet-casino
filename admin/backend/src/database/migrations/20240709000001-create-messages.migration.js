'use strict'

const { MESSAGE_STATUS, MESSAGE_TYPE } = require('@src/utils/constants/chat.constants')

module.exports = {
  /**
   * @param {import('sequelize').QueryInterface} queryInterface
   * @param {import('sequelize').DataTypes} DataTypes
   */
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('messages', {
      id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      actioneeId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'actionee_id',
        references: {
          model: {
            tableName: 'users',
            table: 'users',
            name: 'user',
            schema: 'public',
            delimiter: '.'
          },
          key: 'id'
        }
      },
      recipientId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'recipient_id',
        references: {
          model: {
            tableName: 'users',
            table: 'users',
            name: 'user',
            schema: 'public',
            delimiter: '.'
          },
          key: 'id'
        }
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'message'
      },
      message_binary: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'message_binary'
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: Object.values(MESSAGE_STATUS),
        defaultValue: MESSAGE_STATUS.ACTIVE,
        field: 'status'
      },
      isContainOffensiveWord: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        field: 'is_contain_offensive_word'
      },
      isPrivate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        field: 'is_private'
      },
      chatGroupId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'chat_group_id',
        references: {
          model: {
            tableName: 'chat_groups',
            table: 'chat_groups',
            name: 'chatGroup',
            schema: 'public',
            delimiter: '.'
          },
          key: 'id'
        }
      },
      messageType: {
        type: DataTypes.ENUM,
        allowNull: true,
        values: Object.values(MESSAGE_TYPE),
        default: 'MESSAGE',
        field: 'message_type'
      },
      sharedEvent: {
        type: DataTypes.JSONB,
        allowNull: true,
        defaultValue: {},
        field: 'shared_event'
      },
      tipId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'tip_id'
      },
      replyMessageId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'reply_message_id'
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

    }, { schema: 'public' })
  },

  down: async (queryInterface, _) => {
    await queryInterface.dropTable('messages', { schema: 'public' })
  }
}
