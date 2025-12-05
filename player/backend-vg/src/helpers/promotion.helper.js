import db from '../db/models'
import { generateAffiliateClickId } from '../utils/common'
import { InternalServerErrorType } from '../utils/constants/errors'
import { BONUS_STATUS, BONUS_TYPE } from '../utils/constants/constant'

export async function createPromotionUser (promotionCode, userId, transaction) {
  try {
    if (!promotionCode) return false

    const isAffiliateBonusActive = await db.Bonus.findOne({
      attributes: ['bonusId', 'isActive'],
      where: {
        bonusType: BONUS_TYPE.AFFILIATE_BONUS,
        isActive: true
      },
      transaction
    })

    if (!isAffiliateBonusActive) return false

    const promotionData = await db.PromotionCode.findOne({
      where: { promocode: promotionCode },
      lock: { level: transaction.LOCK.UPDATE, of: db.PromotionCode },
      transaction
    })

    if (!promotionData) return false

    if (promotionData.validTill && new Date(promotionData.validTill) < new Date()) { return false }
    const clickId = await generateAffiliateClickId(promotionData.affiliateId)

    await db.User.update(
      {
        affiliateCode: clickId,
        affiliateId: promotionData.affiliateId
      },
      {
        where: {
          userId
        },
        transaction
      }
    )

    promotionData.useCount = promotionData.useCount + 1

    await promotionData.save({ transaction })

    await db.UserBonus.create(
      {
        bonusId: isAffiliateBonusActive.bonusId,
        userId: userId,
        bonusType: BONUS_TYPE.AFFILIATE_BONUS,
        scAmount: promotionData.bonusSc,
        gcAmount: promotionData.bonusGc,
        status: BONUS_STATUS.PENDING,
        promocodeId: promotionData.promocodeId,
        claimedAt: null
      },
      {
        transaction
      }
    )

    return true
  } catch (error) {
    console.log('Error in ', error)
    throw InternalServerErrorType
  }
}
