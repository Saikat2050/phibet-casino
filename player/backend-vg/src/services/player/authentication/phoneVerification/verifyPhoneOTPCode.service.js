import moment from 'moment'
import ServiceBase from '../../../serviceBase'
import { verifyOTP } from '../../../../libs/twilio'
import { activityLog, trackSokulEvent } from '../../../../utils/common'
import { KYC_STATUS, SOKUL_KYC_STATUS } from '../../../../utils/constants/constant'
import { SUCCESS_MSG } from '../../../../utils/constants/success'

export class VerifyPhoneOTPCodeService extends ServiceBase {
  async run () {
    const {
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context

    const { phone, code, otp } = this.args

    const userData = await UserModel.findOne({
      attributes: [
        'phoneVerified',
        'userId',
        'email',
        'username',
        'phone',
        'phoneCode',
        'kycStatus',
        'newOtpRequested',
        'firstName',
        'lastName',
        'middleName',
        'dateOfBirth',
        'uniqueId'
      ],
      where: {
        phone: `${phone}`,
        phoneCode: `${code}`
      },
      transaction
    })

    if (!userData) {
      return this.addError('InvalidPhoneOrCodeErrorType')
    }

    if (userData.phoneVerified) {
      return this.addError('PhoneAlreadyVerifiedErrorType')
    }

    const then = moment().subtract(10, 'minutes').toDate()

    if (then > userData.newOtpRequested) {
      return this.addError('ExpiredOtpErrorType')
    }

    const mobileVerification = await verifyOTP({ phone: userData.phone, phoneCode: userData.phoneCode, otp })

    if (mobileVerification !== 'approved') return this.addError('InvalidOtpErrorType')
    let sokulData = {
      email: userData.email,
      phone: userData.phone
    }
    let userKycStatus = userData.kycStatus
    if (userData.kycStatus === KYC_STATUS.ACCOUNT_EMAIL_VERIFIED) {
      userKycStatus = KYC_STATUS.ACCOUNT_EMAIL_VERIFIED
      sokulData = { ...sokulData, kyc_status: SOKUL_KYC_STATUS.ACCOUNT_EMAIL_VERIFIED }
    } else if (userData.kycStatus === KYC_STATUS.ACCOUNT_PROFILE_COMPLETED) {
      userKycStatus = KYC_STATUS.ACCOUNT_VERIFIED_PHONE
      sokulData = { ...sokulData, kyc_status: SOKUL_KYC_STATUS.ACCOUNT_VERIFIED_PHONE }
    } else if (userData.kycStatus === KYC_STATUS.ACCOUNT_KYC_VERIFIED) {
      userKycStatus = KYC_STATUS.ACCOUNT_FULLY_VERIFIED
      sokulData = { ...sokulData, kyc_status: SOKUL_KYC_STATUS.ACCOUNT_FULLY_VERIFIED }
    }
    await UserModel.update(
      {
        phoneVerified: true,
        otpVerifiedDate: new Date().getTime(),
        kycStatus: userKycStatus
      },
      {
        where: {
          userId: userData.userId
        },
        transaction
      }
    )

    await activityLog({
      userId: userData.userId,
      originalValue: userData.kycStatus,
      changedValue: userData.kycStatus === KYC_STATUS.ACCOUNT_KYC_VERIFIED ? KYC_STATUS.ACCOUNT_FULLY_VERIFIED : KYC_STATUS.ACCOUNT_VERIFIED_PHONE,
      fieldChanged: 'kycStatus',
      transaction
    })
    const sokulKeys = Object.keys(sokulData)
    if (sokulKeys.length > 1) {
      await trackSokulEvent(sokulData, 'updateUser')
    }
    return {
      success: true,
      message: SUCCESS_MSG.OTP_VERIFY
    }
  }
}
