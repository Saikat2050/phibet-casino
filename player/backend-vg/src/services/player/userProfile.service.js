import ServiceBase from '../serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'
// import { getUserTierDetails } from '../../helpers/tiers.helper'
import { isDailyAndWelcomeBonusClaimed, prepareImageUrl, settingData } from '../../utils/common'
import { PAYMENT_METHOD, TRANSACTION_TYPE } from '../../utils/constants/constant'
export class UserProfileService extends ServiceBase {
  async run () {
    try {
      const {
        dbModels: {
          TransactionBanking: TransactionBankingModel,
        },
        sequelizeTransaction: transaction
      } = this.context

      const { user: { detail: userData } } = this.args

      const transactionDetails = await TransactionBankingModel.findOne({
        where: { actioneeId: userData.userId,
          transactionType: TRANSACTION_TYPE.DEPOSIT,
          isSuccess: true,
          paymentMethod: PAYMENT_METHOD.PUSHCASH
         },
        transaction
      })

      if (transactionDetails) {
        userData.dataValues.isDepositCompleted = true
      } else {
        userData.dataValues.isDepositCompleted = false
      }

      delete userData.dataValues.password

      const [
        claimedResponse,
        settingsData,
        profileImage,
        // tierDetail
      ] = await Promise.all([
        (isDailyAndWelcomeBonusClaimed(userData.userId, userData.createdAt, null)),
        (settingData()),
        (prepareImageUrl(userData?.profileImage))
        // (getUserTierDetails(userData.userId, false, null))
      ])

      userData.dataValues = {
        ...userData.dataValues,
        ...claimedResponse,
        ...settingsData,
        profileImage
        // tierDetail
      }

      return { success: true, data: userData, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
