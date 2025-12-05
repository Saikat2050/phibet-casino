import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { Cache } from '@src/libs/cache'
import { ServiceBase } from '@src/libs/serviceBase'
import { CACHE_KEYS } from '@src/utils/constants/app.constants'
import { Op } from 'sequelize'
import { logAdminActivity } from '@src/utils/logAdminActivity'
import { tableCategoriesMapping } from '@src/utils/constants/adminActivityCategories.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    adminUserId: { type: 'string' },
    id: { type: 'integer' },
    amount: { type: 'number', default: 0.0 },
    lable: { type: 'string' },
    gcCoin: { type: 'number', default: 0 },
    scCoin: { type: 'number', default: 0 },
    isActive: { type: 'boolean', default: false },
    isVisibleInStore: { type: 'boolean', default: false },
    validTill: { type: 'string' },
    validFrom: { type: 'string' },
    customizationSettings: { type: 'object' },
    maxPurchasePerUser: { type: 'string', default: 0 },
    discountAmount: { type: 'string', default: 0.0 },
    discountEndDate: { type: 'string' },
    pricingTiers: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          purchases: { type: 'number' },
          price: { type: 'number' }
        },
        required: ['purchases', 'price']
      },
      additionalProperties: false
    },
    isFeatured: { type: 'boolean', default: false },
    scBonus: { type: 'string', default: 0 },
    gcBonus: { type: 'string', default: 0 },
    packagePurchaseNumber: { type: 'string', default: 0 },
    welcomePackage: { type: 'boolean', default: false },
    timer: { type: 'string' },
    bonusId: { type: 'string' },
    giftable: { type: 'boolean', default: false }
  },
  required: ['id'],
  additionalProperties: false
})

export class UpdatePackageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      id,
      amount,
      lable,
      gcCoin,
      scCoin,
      isActive,
      isVisibleInStore,
      validTill,
      validFrom,
      customizationSettings,
      maxPurchasePerUser,
      discountAmount,
      discountEndDate,
      pricingTiers,
      bonusId,
      giftable,
      isFeatured,
      scBonus,
      gcBonus,
      packagePurchaseNumber,
      welcomePackage,
      timer
    } = this.args
    const transaction = this.context.sequelizeTransaction
    try {
      // Fetch the existing package
      const packageToUpdate = await this.context.sequelize.models.package.findOne({ where: { id }, transaction })
      if (!packageToUpdate) {
        return this.addError('PackageNotFoundErrorType')
      }

      if (discountAmount && +discountAmount >= +amount) return this.addError('DiscountAmountErrorType')
      if (!amount || (+amount <= 0)) return this.addError('NotEnoughAmountErrorType')

      const trackingFields = [
        'amount', 'lable', 'gcCoin', 'scCoin', 'isActive', 'isVisibleInStore', 'validTill', 'validFrom', 'customizationSettings', 'maxPurchasePerUser', 'discountAmount', 'discountEndDate', 'pricingTiers', 'bonusId', 'giftable', 'isFeatured', 'scBonus', 'gcBonus', 'packagePurchaseNumber', 'welcomePackage', 'timer', 'imageUrl'
      ]
      const previousData = Object.fromEntries(trackingFields.map(key => [key, packageToUpdate[key]]))

      // Prepare updates
      const updateData = {
        amount: amount ?? packageToUpdate.amount,
        lable: lable ?? packageToUpdate.lable,
        gcCoin: gcCoin ?? packageToUpdate.gcCoin,
        scCoin: scCoin ?? packageToUpdate.scCoin,
        isActive: isActive ?? packageToUpdate.isActive,
        isVisibleInStore: isVisibleInStore ?? packageToUpdate.isVisibleInStore,
        validTill: validTill ?? packageToUpdate.validTill,
        validFrom: validFrom ?? packageToUpdate.validFrom,
        customizationSettings: customizationSettings ?? packageToUpdate.customizationSettings,
        maxPurchasePerUser: maxPurchasePerUser || null,
        discountAmount: discountAmount || 0,
        discountEndDate: discountEndDate || null,
        pricingTiers: pricingTiers ?? packageToUpdate.pricingTiers,
        bonusId: bonusId ?? packageToUpdate.bonusId,
        giftable: giftable ?? packageToUpdate.giftable,
        isFeatured: isFeatured ?? packageToUpdate.isFeatured,
        scBonus: scBonus || 0,
        gcBonus: gcBonus || 0,
        packagePurchaseNumber: packagePurchaseNumber || 0,
        welcomePackage: welcomePackage ?? packageToUpdate.welcomePackage,
        timer: timer ?? packageToUpdate.timer
      }

      await packageToUpdate.update(updateData, { transaction })
      if (welcomePackage) {
        await this.context.sequelize.models.package.update({ welcomePackage: false }, { where: { id: { [Op.ne]: id }, welcomePackage: true }, transaction })
        await Cache.set(CACHE_KEYS.WELCOME_PACKAGE, packageToUpdate)
      }

      // Update the package

      const modifiedData = Object.fromEntries(trackingFields.map(key => [key, updateData[key]]))
      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: packageToUpdate.id,
        entityType: 'package',
        action: 'update',
        changeTableId: packageToUpdate.id,
        changeTableName: 'packages',
        previousData: { package: previousData },
        modifiedData: { package: modifiedData },
        service: 'update package',
        category: tableCategoriesMapping.packages
      })
      return { packageToUpdate }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
