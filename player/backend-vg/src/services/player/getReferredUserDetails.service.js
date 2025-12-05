import sequelize from 'sequelize'
import ajv from '../../libs/ajv'
import { pageValidation } from '../../utils/common'
import ServiceBase from '../serviceBase'
import { BONUS_STATUS, BONUS_TYPE, TRANSACTION_STATUS, TRANSACTION_TYPE, USER_ACTIVITIES_TYPE } from '../../utils/constants/constant'

const schema = {
  type: 'object',
  properties: {
    id: { type: 'number' },
    limit: { type: ['string', 'null'] },
    page: { type: ['string', 'null'] }
  },
  required: ['userId']
}

const constraints = ajv.compile(schema)

export class GetReferredUserDetailsService extends ServiceBase {
  get constraints () {
    return constraints()
  }

  async run () {
    const {
      dbModels: {
        User: UserModel,
        TransactionBanking: TransactionBankingModel,
        UserBonus: UserBonusModel,
        UserActivities: UserActivitiesModel,
        Bonus: BonusModel
      }
    } = this.context
    const { id, page, limit } = this.args

    try {
      const userExist = await UserModel.findOne({
        where: { userId: id },
        attributes: ['userId', 'isActive']
      })

      if (!userExist) return this.addError('UserNotExistsErrorType')

      const { pageNo, size } = pageValidation(page, limit)

      const referredUsers = await UserModel.findAndCountAll({
        where: { referredBy: id },
        offset: (pageNo - 1) * size,
        limit: size,
        attributes: ['userId', 'email', 'username', 'createdAt'],
        order: [['createdAt', 'DESC']]
      })

      let referralDetails = []

      if (!referredUsers) return { success: true, count: 0, referralAmount: {}, referralDetails }

      referralDetails = await Promise.all(
        referredUsers.rows.map(async (user) => {
          const data = {
            userId: user.userId,
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            totalPurchaseAmount: 0,
            totalGcPurchase: 0,
            totalScPurchase: 0,
            scEarn: 0,
            gcEarn: 0
          }

          const purchaseDetail = await TransactionBankingModel.findOne({
            where: {
              actioneeId: user.userId,
              transactionType: TRANSACTION_TYPE.DEPOSIT,
              status: TRANSACTION_STATUS.SUCCESS
            },
            attributes: [
              [sequelize.fn('SUM', sequelize.col('amount')), 'totalPurchaseAmount'],
              [sequelize.fn('SUM', sequelize.col('gc_coin')), 'totalGcPurchase'],
              [sequelize.fn('SUM', sequelize.col('sc_coin')), 'totalScPurchase']
            ],
            raw: true
          })

          if (purchaseDetail) {
            data.totalPurchaseAmount = purchaseDetail?.totalPurchaseAmount || 0
            data.totalGcPurchase = purchaseDetail?.totalGcPurchase || 0
            data.totalScPurchase = purchaseDetail?.totalScPurchase || 0
          }

          const earningDetail = await UserActivitiesModel.findAll({
            where: {
              userId: id,
              referredUser: user.userId,
              activityType: USER_ACTIVITIES_TYPE.REFERRAL_BONUS_CLAIMED
            },
            include: {
              model: BonusModel,
              attributes: [
                'bonusId',
                'gcAmount',
                'scAmount'
              ]
            },
            raw: true
          })

          if (earningDetail) {
            let scEarn = 0; let gcEarn = 0

            earningDetail.forEach((bonusDetail) => {
              gcEarn += bonusDetail['Bonus.gcAmount']
              scEarn += bonusDetail['Bonus.scAmount']
            })

            data.scEarn = scEarn
            data.gcEarn = gcEarn
          }

          return data
        })
      )

      const referralAmountEarned = await UserBonusModel.findOne({
        where: {
          userId: id,
          status: BONUS_STATUS.CLAIMED,
          bonusType: BONUS_TYPE.REFERRAL_BONUS
        },
        attributes: [
          [sequelize.fn('SUM', sequelize.col('gc_amount')), 'totalGcEarn'],
          [sequelize.fn('SUM', sequelize.col('sc_amount')), 'totalScEarn']
        ],
        raw: true
      })

      const referralAmount = {
        totalGcEarn: referralAmountEarned?.totalGcEarn || 0,
        totalScEarn: referralAmountEarned?.totalScEarn || 0
      }

      return { success: true, count: referredUsers?.count, referralAmount, referralDetails }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
