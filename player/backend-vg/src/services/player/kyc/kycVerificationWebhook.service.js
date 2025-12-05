import axios from 'axios'
import crypto from 'crypto'
import ServiceBase from '../../serviceBase'
import config from '../../../configs/app.config'
import { KYC_STATUS, SOKUL_KYC_STATUS } from '../../../utils/constants/constant'
import KycCompletedStatusEmitter from '../../../socket-resources/emitter/kycStatusEmitter.emitter'
import { getUserKycDetails, splitCountryCode, trackSokulEvent } from '../../../utils/common'

export class KycVerificationCallbackService extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context

    const { applicantId, externalUserId, type, reviewStatus, reviewResult } =
      this.args
    console.log('?????????????????????????????????', this.args)
    let update = {}
    const parsedUserId = /^[0-9]+$/.test(externalUserId)
      ? Number(externalUserId)
      : externalUserId
    if (isNaN(parsedUserId)) {
      return {
        success: false,
        message: `User external ID is not correct : ${externalUserId}!!`
      }
    }
    const user = await UserModel.findOne({
      attributes: ['userId', 'kycStatus', 'phoneVerified', 'email'],
      where: {
        userId: parsedUserId
      },
      transaction
    })

    if (!user) {
      return {
        success: false,
        message: `User external ID is not correct : ${externalUserId}!!`
      }
    }

    if (type === 'applicantCreated') {
      update = {
        ...update,
        kycApplicantId: applicantId,
        sumsubKycStatus: reviewStatus
      }
    }

    if (
      type === 'applicantPending' ||
      type === 'applicantOnHold' ||
      type === 'videoIdentStatusChanged' ||
      type === 'applicantDeleted' ||
      type === 'applicantPrechecked' ||
      type === 'applicantActionOnHold'
    ) {
      if (type === 'applicantPending' && config.get('env') !== 'production') {
        const url = `/resources/applicants/${applicantId}/status/testCompleted`
        const requestBody = { reviewAnswer: 'GREEN' }
        const timeStamp = Math.floor(Date.now() / 1000)
        const sign = crypto.createHmac('sha256', config.get('sumSub.secret'))
        sign.update(`${timeStamp}POST${url}`)
        sign.update(JSON.stringify(requestBody))

        const options = {
          url: `https://api.sumsub.com/resources/applicants/${applicantId}/status/testCompleted`,
          method: 'POST',
          headers: {
            'X-App-Token': config.get('sumSub.token'),
            'X-App-Access-Sig': sign.digest('hex'),
            'X-App-Access-Ts': `${timeStamp}`
          },
          data: { reviewAnswer: 'GREEN' }
        }
        try {
          await axios(options)
        } catch (error) {
          console.log(error.response.data)
        }
      }
      update = { ...update, sumsubKycStatus: reviewStatus }
    }

    if (type === 'applicantReviewed' && reviewResult.reviewAnswer === 'GREEN') {
      const userKycDetails = await getUserKycDetails(applicantId)
      console.log('userKycDetails==========', userKycDetails)
      if (userKycDetails && Array.isArray(userKycDetails.checks) && userKycDetails.checks.length > 0) {
        console.log('userKycDetails phone confirmation check info==========', userKycDetails?.checks[0]?.phoneConfirmationCheckInfo?.phone)
        const phoneDetails = splitCountryCode(userKycDetails?.checks[0]?.phoneConfirmationCheckInfo?.phone)
        update = {
          ...update,
          sumsubKycStatus: reviewStatus,
          kycStatus: user.kycStatus === KYC_STATUS.ACCOUNT_PROFILE_COMPLETED ? KYC_STATUS.ACCOUNT_FULLY_VERIFIED : KYC_STATUS.ACCOUNT_KYC_VERIFIED,
          phone: phoneDetails?.phoneNumber,
          phoneCode: phoneDetails?.countryCode,
          phoneVerified: true
        }
        trackSokulEvent({ email: user?.email, phone: phoneDetails?.phoneNumber, kyc_status: user.kycStatus === KYC_STATUS.ACCOUNT_PROFILE_COMPLETED ? SOKUL_KYC_STATUS.ACCOUNT_FULLY_VERIFIED : SOKUL_KYC_STATUS.ACCOUNT_KYC_VERIFIED }, 'updateUser')
      }
    }
    if (
      type === 'applicantActionReviewed' &&
      reviewResult.reviewAnswer === 'GREEN'
    ) {
      update = { ...update, sumsubKycStatus: reviewStatus }
    }

    if (type === 'applicantReset') {
      update = {
        ...update,
        kycStatus: KYC_STATUS.ACCOUNT_PROFILE_COMPLETED,
        sumsubKycStatus: reviewStatus
      }
    }
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>', update)

    await UserModel.update(update, {
      where: {
        userId: externalUserId
      },
      transaction
    })

    KycCompletedStatusEmitter.emitKycStatus(update, externalUserId)

    return 'ok'
  }
}
