import axios from 'axios'
import crypto from 'crypto'
import ServiceBase from '../../serviceBase'
import config from '../../../configs/app.config'
import { SUCCESS_MSG } from '../../../utils/constants/success'
import { STATUS_VALUE } from '../../../utils/constants/constant'

export class InitKycService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: {
        State: StateModel,
        User: UserModel
      },
      sequelizeTransaction: transaction
    } = this.context

    if (!user.isEmailVerified) return this.addError('EmailNotVerifiedErrorType')

    // if (user?.kycApplicantId && user?.sumsubKycStatus === STATUS_VALUE.PENDING) return this.addError('kycVerificationAlreadyInProgressErrorType')

    // if (user?.sumsubKycStatus === STATUS_VALUE.APPROVED) return this.addError('KYCAlreadyApprovedErrorType')

    // if (!user.kycApplicantId) {
    //   const stateName = await StateModel.findOne({
    //     attributes: ['name'],
    //     where: {
    //       stateId: +user.state
    //     },
    //     transaction
    //   })

    //   const createKycApplicant = {
    //     externalUserId: `${user.uniqueId}`,
    //     email: user.email,
    //     lang: 'en-US',
    //     fixedInfo: {
    //       firstName: user.firstName,
    //       lastName: user.lastName,
    //       gender: user.gender === 'male' ? 'M' : 'F',
    //       dob: user.dateOfBirth,
    //       countryOfBirth: 'USA',
    //       state: stateName?.name,
    //       street: user?.addressLine_1,
    //       buildingName: user?.addressLine_2,
    //       postCode: user?.zipCode,
    //       town: user?.city
    //     }
    //   }

    //   // if (user.phone) createKycApplicant.phone = `+${user?.phoneCode}${user.phone}`
    //   if (user.middleName) createKycApplicant.fixedInfo.middleName = user.middleName

    //   const createApplicant = await this.sendRequest(JSON.stringify(createKycApplicant), '/resources/applicants?levelName=basic-kyc-level')

    //   await UserModel.update({ kycApplicantId: createApplicant.id }, { where: { userId: user.userId }, transaction })
    // }

    // const data = await this.sendRequest(null, `/resources/accessTokens?userId=${user.userId}&levelName=${'basic-kyc-level'}&ttlInSecs=${1200}`)

    const data = {
      userId: user.userId,
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      phoneNumber: user.phoneNumber,
      licenseKey: config.get('kycSeon.license_key'),
      referenceId: user.uniqueId,
      country: user.country
    }

    return { success: true, ...data, message: SUCCESS_MSG.UPDATE_SUCCESS }
  }

  // async sendRequest (data, url) {
  //   const timeStamp = Math.floor(Date.now() / 1000)
  //   const sign = crypto.createHmac('sha256', config.get('sumSub.secret'))
  //   sign.update(timeStamp + 'POST' + url)

  //   if (data) sign.update(data)
  //   const body = data ? { data } : {}

  //   const options = {
  //     method: 'POST',
  //     url: `${config.get('sumSub.url')}${url}`,
  //     headers: {
  //       'X-App-Token': config.get('sumSub.token'),
  //       'X-App-Access-Sig': sign.digest('hex'),
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //       'X-App-Access-Ts': `${timeStamp}`
  //     },
  //     ...body
  //   }
  //   try {
  //     const { data } = await axios(options)
  //     return data
  //   } catch (error) {
  //     console.log(error.response.data)
  //     return this.addError('InternalServerErrorType')
  //   }
  // }
}
