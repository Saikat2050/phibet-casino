import { APIError } from '@src/errors/api.error'
import { populateSettingsCache } from '@src/helpers/populateLocalCache.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { SETTING_KEYS } from '@src/utils/constants/app.constants'
import { GetSettingsService } from './getSettings.service'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    key: {
      enum: [SETTING_KEYS.ALLOW_BETTING, SETTING_KEYS.MAINTENANCE, SETTING_KEYS.CASINO, SETTING_KEYS.DEPOSIT_KYC_REQUIRED,
        SETTING_KEYS.DEPOSIT_PHONE_REQUIRED, SETTING_KEYS.DEPOSIT_PROFILE_REQUIRED, SETTING_KEYS.WITHDRAW_KYC_REQUIRED, SETTING_KEYS.WITHDRAW_PHONE_REQUIRED,
        SETTING_KEYS.WITHDRAW_PROFILE_REQUIRED, SETTING_KEYS.PAYMENT_PROVIDER_DEPOSIT, SETTING_KEYS.PAYMENT_PROVIDER_WITHDRAW, SETTING_KEYS.GAME_PLAY_KYC_REQUIRED
      ]
    },
    providerId: { type: ['string', 'null'] },
    status: { type: ['boolean', 'null'] }
  },
  required: ['key']
})

export class ToggleSettingsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const { key, status, providerId } = this.args
    const transaction = this.context.sequelizeTransaction

    try {
      switch (key) {
        case SETTING_KEYS.PAYMENT_PROVIDER_DEPOSIT: {
          await this.context.sequelize.models.paymentProvider.update({ depositAllowed: status }, { where: { id: providerId }, transaction })
          const [, updatedData] = await this.context.sequelize.models.paymentProvider.update({ withdrawAllowed: this.context.sequelize.literal('NOT withdraw_allowed') }, { where: { id: providerId }, returning: ['id', 'withdraw_allowed'], transaction })

          logAdminActivity({
            adminUserId: this.args.adminUserId,
            entityId: providerId,
            entityType: 'setting',
            action: 'update',
            changeTableId: providerId,
            changeTableName: 'settings',
            previousData: { setting: { withdrawAllowed: !updatedData[0].withdrawAllowed } },
            modifiedData: { setting: { withdrawAllowed: updatedData[0].withdrawAllowed } },
            service: 'toggle setting',
            category: tableCategoriesMapping.settings
          })
          break
        }

        case SETTING_KEYS.PAYMENT_PROVIDER_WITHDRAW: {
          await this.context.sequelize.models.paymentProvider.update({ withdrawAllowed: status }, { where: { id: providerId }, transaction })
          const [, updatedData] = await this.context.sequelize.models.paymentProvider.update({ withdrawAllowed: this.context.sequelize.literal('NOT withdraw_allowed') }, { where: { id: providerId }, returning: ['id', 'withdraw_allowed'], transaction })

          logAdminActivity({
            adminUserId: this.args.adminUserId,
            entityId: providerId,
            entityType: 'setting',
            action: 'update',
            changeTableId: providerId,
            changeTableName: 'settings',
            previousData: { setting: { withdrawAllowed: !updatedData[0].withdrawAllowed } },
            modifiedData: { setting: { withdrawAllowed: updatedData[0].withdrawAllowed } },
            service: 'toggle setting',
            category: tableCategoriesMapping.settings
          })
          break
        }

        default: {
          const { result: settings } = await GetSettingsService.execute({ keys: [key] }, this.context)
          const [, updatedRows] = await this.context.sequelize.models.setting.update({
            value: String(!settings[key])
          }, {
            where: { key }, transaction, returning: true
          })

          logAdminActivity({
            adminUserId: this.args.adminUserId,
            entityId: updatedRows[0]?.id,
            entityType: 'setting',
            action: 'update',
            changeTableId: updatedRows[0]?.id,
            changeTableName: 'settings',
            previousData: { setting: settings },
            modifiedData: {
              setting: Object.fromEntries(updatedRows.map(row => [row.key, row.value]))
            },
            service: 'toggle setting',
            category: tableCategoriesMapping.settings
          })

          if ([SETTING_KEYS.DEPOSIT_KYC_REQUIRED, SETTING_KEYS.DEPOSIT_PHONE_REQUIRED, SETTING_KEYS.DEPOSIT_PROFILE_REQUIRED, SETTING_KEYS.WITHDRAW_KYC_REQUIRED, SETTING_KEYS.WITHDRAW_PHONE_REQUIRED,
            SETTING_KEYS.WITHDRAW_PROFILE_REQUIRED].includes(key)) {
            switch (key) {
              case SETTING_KEYS.DEPOSIT_KYC_REQUIRED:
                await this.context.sequelize.models.paymentProvider.update({ depositKycRequired: !settings[key] }, { where: { depositKycRequired: settings[key] }, transaction })
                break

              case SETTING_KEYS.DEPOSIT_PHONE_REQUIRED:
                await this.context.sequelize.models.paymentProvider.update({ depositPhoneRequired: !settings[key] }, { where: { depositPhoneRequired: settings[key] }, transaction })
                break

              case SETTING_KEYS.DEPOSIT_PROFILE_REQUIRED:
                await this.context.sequelize.models.paymentProvider.update({ depositProfileRequired: !settings[key] }, { where: { depositProfileRequired: settings[key] }, transaction })
                break

              case SETTING_KEYS.WITHDRAW_KYC_REQUIRED:
                await this.context.sequelize.models.paymentProvider.update({ withdrawKycRequired: !settings[key] }, { where: { withdrawKycRequired: settings[key] }, transaction })
                break

              case SETTING_KEYS.WITHDRAW_PHONE_REQUIRED:
                await this.context.sequelize.models.paymentProvider.update({ withdrawPhoneRequired: !settings[key] }, { where: { withdrawPhoneRequired: settings[key] }, transaction })
                break

              case SETTING_KEYS.WITHDRAW_PROFILE_REQUIRED:
                await this.context.sequelize.models.paymentProvider.update({ withdrawProfileRequired: !settings[key] }, { where: { withdrawProfileRequired: settings[key] }, transaction })
                break
            }
          }

          break
        }
      }

      await populateSettingsCache(this.context)

      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
