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
  required: ['lable', 'amount', 'gcCoin', 'scCoin', 'isActive', 'isVisibleInStore']
})

export class CreatePackageService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      amount,
      lable,
      gcCoin,
      scCoin,
      isActive,
      isVisibleInStore,
      orderId,
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

    try {
      // Check if a package with the same orderId exists
      const existingPackage = await this.context.sequelize.models.package.findOne({ where: { [Op.or]: { lable, amount } }, attributes: ['id', 'lable', 'amount', 'gcCoin', 'scCoin'] })
      if (
        existingPackage &&
        ((parseFloat(existingPackage.amount) === parseFloat(amount) &&
        parseFloat(existingPackage.scCoin) === parseFloat(scCoin) &&
        parseFloat(existingPackage.gcCoin) === parseFloat(gcCoin)) || (existingPackage.lable.toLowerCase() === lable.toLowerCase()))
      ) {
        return this.addError('PackageAlreadyExistsErrorType')
      }

      if (discountAmount && +discountAmount >= +amount) return this.addError('DiscountAmountErrorType')
      if (!amount || (+amount <= 0)) return this.addError('NotEnoughAmountErrorType')

      // Create the new package
      const sweepPackage = await this.context.sequelize.models.package.create({
        amount,
        lable,
        gcCoin,
        scCoin,
        isActive,
        isVisibleInStore,
        orderId,
        validTill,
        validFrom,
        customizationSettings,
        maxPurchasePerUser: maxPurchasePerUser || null,
        discountAmount: discountAmount || 0.0,
        discountEndDate: discountEndDate || null,
        pricingTiers,
        bonusId,
        giftable,
        isFeatured,
        scBonus: scBonus || null,
        gcBonus: gcBonus || null,
        packagePurchaseNumber: packagePurchaseNumber || null,
        welcomePackage,
        timer: timer || null
      })

      logAdminActivity({
        adminUserId: this.args.adminUserId,
        entityId: sweepPackage?.id,
        entityType: 'package',
        action: 'create',
        changeTableId: sweepPackage?.id,
        changeTableName: 'packages',
        previousData: { package: null },
        modifiedData: { package: sweepPackage?.get({ plain: true }) },
        service: 'create package',
        category: tableCategoriesMapping.packages
      })

      if (welcomePackage) {
        await this.context.sequelize.models.package.update({ welcomePackage: false }, { where: { id: { [Op.ne]: sweepPackage.id }, welcomePackage: true } })
        await Cache.set(CACHE_KEYS.WELCOME_PACKAGE, sweepPackage)
      }

      return { sweepPackage }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
