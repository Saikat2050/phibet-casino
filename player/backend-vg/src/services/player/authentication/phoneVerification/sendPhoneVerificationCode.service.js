import ServiceBase from '../../../serviceBase'
import { sendOTP } from '../../../../libs/twilio'
import { SUCCESS_MSG } from '../../../../utils/constants/success'

export class SendPhoneVerificationCodeService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: { User: UserModel },
      sequelizeTransaction: transaction
    } = this.context

    const { phoneCode, phone } = this.args

    const numberExist = await UserModel.findOne({
      attributes: ['userId', 'phoneCode', 'phone', 'newOtpRequested'],
      where: {
        phone: phone + '',
        phoneCode: phoneCode + ''
      },
      raw: true
    })

    if (numberExist && numberExist.userId !== user?.userId) {
      return this.addError('PhoneExistErrorType')
    }

    if (user.phoneVerified) {
      return this.addError('PhoneAlreadyVerifiedErrorType')
    }

    const otpRequestedTime = new Date(user.newOtpRequested).getTime()
    const currentTime = new Date().getTime()

    const diff = (currentTime - otpRequestedTime) / 1000
    if (diff < 60) {
      return this.addError('WaitTimeErrorType')
    }

    const otpSend = await sendOTP({ phone: phone, phoneCode: phoneCode })

    if (otpSend === 'MaxAttempts') {
      return this.addError('MaxAttemptsReachedForPhoneVerificationError')
    } else if (otpSend === 'InvalidPhoneOrCodeErrorType') {
      return this.addError('InvalidPhoneOrCodeErrorType')
    } else if (!otpSend) {
      return this.addError('InvalidPhoneOrCodeErrorType')
    }

    await UserModel.update(
      {
        phoneVerified: false,
        phone: phone,
        phoneCode: phoneCode,
        newOtpRequested: new Date().getTime()
      },
      {
        where: {
          userId: user?.userId
        },
        transaction
      }
    )
    await transaction.commit()

    return {
      success: true,
      message: SUCCESS_MSG.OTP_SENT
    }
  }
}
