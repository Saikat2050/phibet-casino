import jwt from 'jsonwebtoken'
import sequelize, { Op } from 'sequelize'
import ServiceBase from '../serviceBase'
import config from '../../configs/app.config'
import { plus, round } from 'number-precision'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { pageValidation, prepareImageUrl } from '../../utils/common'
import { BONUS_TYPE, TRANSACTION_STATUS, TRANSACTION_TYPE, USER_ACTIVITIES_TYPE } from '../../utils/constants/constant'

export class GetPackagesService extends ServiceBase {
  async run () {
    const { page, limit } = this.args
    try {
      const {
        dbModels: {
          Bonus: BonusModel,
          Package: PackageModel,
          UserActivities: UserActivitiesModel,
          TransactionBanking: TransactionBankingModel
        }
      } = this.context
      const { pageNo, size } = pageValidation(page, limit)
      let userId
      const token = this.context?.req?.headers?.accesstoken

      try {
        if (token) {
          const tokenPayload = jwt.verify(token, config.get('jwt.loginTokenSecret'))
          userId = tokenPayload?.id
        }
      } catch (error) {}

      let firstPurchaseFlag = false
      let isFirstPurchaseBonusActive = false
      if (userId) {
        const [isFirstPurchaseBonusClaimed, isFirstDeposit] = await Promise.all(
          [
            UserActivitiesModel.findOne({
              where: {
                userId: userId,
                activityType: USER_ACTIVITIES_TYPE.FIRST_PURCHASE_BONUS
              }
            }),
            TransactionBankingModel.findOne({
              where: {
                actioneeId: userId,
                transactionType: TRANSACTION_TYPE.DEPOSIT,
                isSuccess: true
              }
            })
          ]
        )
        firstPurchaseFlag = !isFirstPurchaseBonusClaimed && !isFirstDeposit
      }

      const isFirstPurchaseBonusExist = await BonusModel.findOne({
        where: {
          isActive: true,
          bonusType: BONUS_TYPE.FIRST_PURCHASE_BONUS
        },
        raw: true
      })
      isFirstPurchaseBonusActive = !!isFirstPurchaseBonusExist

      const packageData = await PackageModel.findAndCountAll({
        where: {
          isActive: true,
          isVisibleInStore: true,
          [Op.and]: [
            {
              [Op.or]: [
                { validTill: { [Op.gte]: new Date(Date.now()) } },
                { validTill: { [Op.is]: null } }
              ]
            },
            {
              [Op.or]: [
                { validFrom: { [Op.is]: null } },
                { validFrom: { [Op.lte]: new Date(Date.now()) } }
              ]
            }
          ]
        },
        order: [
          sequelize.literal(`
            CASE
              WHEN "is_special_package" = true AND "first_purchase_bonus_applicable" = true THEN 1
              ELSE 2
            END
          `),
          ['isSpecialPackage', 'DESC'],
          ['firstPurchaseApplicable', 'DESC'],
          ['orderId', 'ASC']
        ],
        limit: size,
        offset: (pageNo - 1) * size
      })

      let filteredPackages = []

      filteredPackages = await Promise.all(packageData?.rows.map(async packages => {
        // Base check for welcomePurchase offer, so that without userId API's call's get data
        if (packages.welcomePurchaseBonusApplicable) return null

        if (userId && packages.purchaseLimitPerUser > 0) {
          const packagePurchaseCount = await TransactionBankingModel.count({
            where: {
              actioneeId: userId,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.DEPOSIT,
              packageId: packages.packageId
            }
          })
          if (packagePurchaseCount >= packages.purchaseLimitPerUser) {
            return null
          }
        }

        if (userId && packages?.playerId?.length > 0) {
          if (!packages.playerId.includes(userId)) {
            return null
          }
        }

        if (packages?.imageUrl !== '' && packages?.imageUrl !== null) {
          packages.imageUrl = prepareImageUrl(packages.imageUrl)
        }

        packages.dataValues.scCoin = +round(+plus(packages.scCoin, packages.bonusSc), 2)
        packages.dataValues.gcCoin = +round(+plus(packages.gcCoin, packages.bonusGc), 2)

        packages.dataValues.isUserFirstPurchaseEligible = packages.firstPurchaseApplicable && firstPurchaseFlag && isFirstPurchaseBonusActive
        packages.dataValues.totalScAmt = packages.firstPurchaseApplicable && firstPurchaseFlag && isFirstPurchaseBonusActive ? +round(+plus(packages.scCoin, packages.firstPurchaseScBonus), 2) : +round(packages.scCoin, 2)
        packages.dataValues.totalGcAmt = packages.firstPurchaseApplicable && firstPurchaseFlag && isFirstPurchaseBonusActive ? +round(+plus(packages.gcCoin, packages.firstPurchaseGcBonus), 2) : +round(packages.gcCoin, 2)

        return packages
      }))

      filteredPackages = filteredPackages.filter(packageDetail => packageDetail !== null)

      packageData.rows = filteredPackages
      packageData.count = filteredPackages.length

      return {
        success: true,
        data: { packageData },
        message: SUCCESS_MSG.GET_SUCCESS
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
