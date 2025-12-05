'use strict'

import { CHAT_SETTING_TYPES } from '@src/utils/constants/chat.constants'

/** @type {import('sequelize-cli').Migration} */
async function up(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()

  try {
    const now = new Date()

    const chatSettingsToSeed = [
      {
        title: 'Font Size',
        slug: CHAT_SETTING_TYPES.FONT,
        type: 'dropdown',
        options: [
          { label: '8px', value: '8px' },
          { label: '10px', value: '10px' },
          { label: '12px', value: '12px' },
          { label: '14px', value: '14px' },
          { label: '16px', value: '16px' },
          { label: '18px', value: '18px' },
          { label: '20px', value: '20px' }
        ],
        value: '12px'
      },
      {
        title: 'Notification Sound',
        slug: CHAT_SETTING_TYPES.NOTIFICATION_SOUND,
        type: 'dropdown',
        options: [
          { label: 'All New Messages', value: 'all-new-messages' },
          { label: 'Mentions Only', value: 'mentions-only' },
          { label: 'No Sound', value: 'no-sound' }
        ],
        value: 'all-new-messages'
      },
      {
        title: 'Display GIFs',
        slug: CHAT_SETTING_TYPES.DISPLAY_GIFS,
        type: 'boolean',
        options: null,
        value: true
      },
      {
        title: 'Enable Chat',
        slug: CHAT_SETTING_TYPES.ENABLE_CHAT,
        type: 'boolean',
        options: null,
        value: true
      }
    ]

    for (const setting of chatSettingsToSeed) {
      const existing = await queryInterface.sequelize.query(
        `SELECT id FROM chat_settings WHERE slug = :slug LIMIT 1`,
        {
          replacements: { slug: setting.slug },
          type: Sequelize.QueryTypes.SELECT,
          transaction
        }
      )

      if (!existing?.[0]) {
        await queryInterface.sequelize.query(
          `INSERT INTO chat_settings (
            title, slug, type, options, value, created_at, updated_at
          ) VALUES (
            :title, :slug, :type, :options, :value, :createdAt, :updatedAt
          )`,
          {
            replacements: {
              title: setting.title,
              slug: setting.slug,
              type: setting.type,
              options: setting.options ? JSON.stringify(setting.options) : null,
              value:
                typeof setting.value === 'boolean'
                  ? String(setting.value) // store boolean as string
                  : setting.value,
              createdAt: now,
              updatedAt: now
            },
            type: Sequelize.QueryTypes.INSERT,
            transaction
          }
        )
      }
    }

    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

async function down(queryInterface, Sequelize) {
  const transaction = await queryInterface.sequelize.transaction()
  try {
    await queryInterface.bulkDelete(
      'chat_settings',
      {
        slug: {
          [Sequelize.Op.in]: [
            CHAT_SETTING_TYPES.FONT,
            CHAT_SETTING_TYPES.NOTIFICATION_SOUND,
            CHAT_SETTING_TYPES.DISPLAY_GIFS,
            CHAT_SETTING_TYPES.ENABLE_CHAT
          ]
        }
      },
      { transaction }
    )
    await transaction.commit()
  } catch (err) {
    await transaction.rollback()
    throw err
  }
}

export { up, down }
