import sequelize, { Op } from 'sequelize'
import ServiceBase from '../serviceBase'
import {
  BONUS_TYPE,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE
} from '../../utils/constants/constant'
import config from '../../configs/app.config'

export default class GetReferralBonusDetailService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: {
        User: UserModel,
        Bonus: BonusModel,
        CasinoTransaction: CasinoTransactionModel,
        TransactionBanking: TransactionBankingModel
      }
    } = this.context

    const isBonusExist = await BonusModel.findOne({
      where: {
        bonusType: BONUS_TYPE.REFERRAL_BONUS,
        minimumPurchase: null,
        isActive: true
      },
      attributes: ['gcAmount', 'scAmount', 'bonusId', 'minimumPurchase'],
      order: [['createdAt', 'ASC'], ['bonusId', 'ASC']],
      raw: true
    })

    if (!isBonusExist) this.addError('BonusNotFoundErrorType')

    // Referral Bonus Details
    const referralBonus = await BonusModel.findAll({
      where: {
        isActive: true,
        bonusType: BONUS_TYPE.REFERRAL_BONUS,
        minimumPurchase: { [Op.ne]: null }
      },
      attributes: ['gcAmount', 'scAmount', 'bonusId', 'minimumPurchase'],
      order: [['minimumPurchase', 'ASC']],
      raw: true
    })

    // Number of referred users
    const referredUsers = await UserModel.findAndCountAll({
      where: {
        referredBy: user.userId
      },
      attributes: ['userId'],
      raw: true
    })

    // Number of users who have made there first purchase.
    let qualifiedUsers = 0

    if (referredUsers?.count) {
      await Promise.all(
        referredUsers.rows.map(async (userData) => {
          const transactionExist = await TransactionBankingModel.findOne({
            where: {
              actioneeId: userData.userId,
              status: TRANSACTION_STATUS.SUCCESS,
              transactionType: TRANSACTION_TYPE.DEPOSIT
            }
          })

          if (transactionExist) {
            qualifiedUsers++
          }
        })
      )
    }
    // Amount Claimed
    const amount = await CasinoTransactionModel.findOne({
      attributes: [
        [
          sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('sc')), 0),
          'scSum'
        ],
        [
          sequelize.fn('COALESCE', sequelize.fn('SUM', sequelize.col('gc')), 0),
          'gcSum'
        ]
      ],
      where: {
        userId: user.userId,
        actionType: BONUS_TYPE.REFERRAL_BONUS
      },
      raw: true
    })

    const maxEarnCoin = await BonusModel.findOne({
      where: {
        isActive: true,
        bonusType: BONUS_TYPE.REFERRAL_BONUS,
        minimumPurchase: { [Op.ne]: null }
      },
      attributes: [
        [sequelize.fn('SUM', sequelize.col('gc_amount')), 'totalGcEarn'],
        [sequelize.fn('SUM', sequelize.col('sc_amount')), 'totalScEarn']
      ],
      raw: true
    })

    return {
      maxSc: maxEarnCoin?.totalScEarn || 0,
      maxGc: maxEarnCoin?.totalGcEarn || 0,
      referralBonus,
      referredUsers: referredUsers?.count || 0,
      qualifiedUsers,
      gcCoinsEarned: amount.gcSum || 0,
      scCoinsEarned: amount.scSum || 0,
      referralLink: `${config.get('frontendUrl')}/referral?referralcode=${user.referralCode}`
    }
  }
}
