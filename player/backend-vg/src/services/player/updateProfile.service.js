import ServiceBase from '../serviceBase'
import { activityLog, findUser, sendSeonKycAmlData, trackSokulEvent } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { KYC_STATUS, SOKUL_KYC_STATUS } from '../../utils/constants/constant'
import moment from 'moment'
export class UpdateProfileService extends ServiceBase {
  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: { User: UserModel, State: StateModel },
      sequelizeTransaction: transaction
    } = this.context

    const {
      firstName,
      lastName,
      middleName,
      dateOfBirth,
      gender,
      city,
      state,
      country,
      zipCode,
      addressLine_1: addressLine,
      title
    } = this.args

    const isEmailLogin = !!user.email

    if (isEmailLogin && !user.isEmailVerified) return this.addError('EmailNotVerifiedErrorType')

    const userUpdate = {
      title: title?.trim(),
      firstName: firstName?.trim(),
      lastName: lastName?.trim(),
      gender: gender?.trim(),
      city: city?.trim(),
      state: +state,
      countryCode: +country,
      zipCode: zipCode?.trim(),
      kycStatus: KYC_STATUS.ACCOUNT_PROFILE_COMPLETED,
      addressLine_1: addressLine,
      profileCompleted: true
    }
    let sokulData = {
      email: user.email
    }
    if (user.kycStatus === KYC_STATUS.ACCOUNT_KYC_VERIFIED || user.kycStatus === KYC_STATUS.ACCOUNT_FULLY_VERIFIED || user.kycStatus === KYC_STATUS.APPROVED) delete userUpdate.kycStatus // Don't let kycStatus change if KYC is verified once.

    if (user.kycStatus === KYC_STATUS.ACCOUNT_EMAIL_VERIFIED && user.phoneVerified) userUpdate.kycStatus = KYC_STATUS.ACCOUNT_VERIFIED_PHONE
    if (user.kycStatus === KYC_STATUS.ACCOUNT_PROFILE_COMPLETED && user.phoneVerified) userUpdate.kycStatus = KYC_STATUS.ACCOUNT_VERIFIED_PHONE
    if (user.kycStatus === KYC_STATUS.ACCOUNT_VERIFIED_PHONE) userUpdate.kycStatus = KYC_STATUS.ACCOUNT_VERIFIED_PHONE

    sokulData = { ...sokulData, kyc_status: SOKUL_KYC_STATUS.ACCOUNT_VERIFIED_PHONE }

    if (middleName) userUpdate.middleName = middleName.trim()

    if (dateOfBirth && new Date(new Date().setUTCFullYear(new Date().getUTCFullYear() - 18)) < new Date(dateOfBirth)) return this.addError('UserBelow18ErrorType')

    if (dateOfBirth) {
      userUpdate.dateOfBirth = dateOfBirth
    }
    if (title) {
      sokulData = { ...sokulData, title: title }
      await activityLog({
        userId: user.userId,
        fieldChanged: 'title',
        originalValue: user.title,
        changedValue: title,
        transaction
      })
    }
    await UserModel.update(userUpdate, {
      where: {
        userId: user.userId
      },
      transaction
    })

    if (firstName && user.firstName !== firstName) {
      sokulData = { ...sokulData, first_name: firstName }
      await activityLog({
        userId: user.userId,
        fieldChanged: 'first name',
        originalValue: user.firstName,
        changedValue: firstName,
        transaction
      })
    }
    if (lastName && user.lastName !== lastName) {
      sokulData = { ...sokulData, last_name: lastName }
      await activityLog({
        userId: user.userId,
        fieldChanged: 'last name',
        originalValue: user.firstName,
        changedValue: lastName,
        transaction
      })
    }

    if (middleName && user.middleName !== middleName) {
      await activityLog({
        userId: user.userId,
        fieldChanged: 'middle name',
        originalValue: user.middleName,
        changedValue: middleName,
        transaction
      })
    }

    if (gender && user.gender !== gender) {
      sokulData = { ...sokulData, gender: gender }
      await activityLog({
        userId: user.userId,
        fieldChanged: 'gender',
        originalValue: user.middleName,
        changedValue: gender,
        transaction
      })
    }

    if (city && user.city !== city) {
      await activityLog({
        userId: user.userId,
        fieldChanged: 'city',
        originalValue: user.city,
        changedValue: city,
        transaction
      })
    }
    if (state && user?.state !== state.toString()) {
      const [oldStateName, newStateName] = await Promise.all([
        (StateModel.findOne({ attributes: ['name'], where: { stateId: +user.state } })),
        (StateModel.findOne({ attributes: ['name'], where: { stateId: state } }))])
      sokulData = { ...sokulData, state: newStateName?.name }
      await activityLog({
        userId: user.userId,
        fieldChanged: 'state',
        originalValue: oldStateName?.name,
        changedValue: newStateName?.name,
        transaction
      })
    }

    if (zipCode && user.zipCode !== zipCode) {
      await activityLog({
        userId: user.userId,
        fieldChanged: 'zip code',
        originalValue: user.zipCode,
        changedValue: zipCode,
        transaction
      })
    }

    if (dateOfBirth && String(new Date(user.dateOfBirth)) !== String(new Date(dateOfBirth))) {
      console.log('formatDOB', dateOfBirth)
      const isAlreadyFormatted = moment(dateOfBirth, 'YYYY-MM-DD', true).isValid()

      sokulData = {
        ...sokulData,
        birth: isAlreadyFormatted
          ? dateOfBirth
          : moment(dateOfBirth, 'MM-DD-YYYY').format('YYYY-MM-DD')
      }
      //   sokulData = { ...sokulData, birth: moment(dateOfBirth, 'MM-DD-YYYY').format('YYYY-MM-DD') }
      console.log('>>>>>>>>>>>>>>>>>Sokul', sokulData)
      await activityLog({
        userId: user.userId,
        fieldChanged: 'date of birth',
        originalValue: user.dateOfBirth,
        changedValue: dateOfBirth,
        transaction
      })
    }

    if (addressLine && user.addressLine_1 !== addressLine) {
      await activityLog({
        userId: user.userId,
        fieldChanged: 'address line 1',
        originalValue: user.addressLine_1,
        changedValue: addressLine,
        transaction
      })
    }

    const data = await findUser({ userId: user.userId }, { transaction })
    const sokulKeys = Object.keys(sokulData)
    if (sokulKeys.length > 1) {
      const sokulResponse = await trackSokulEvent(sokulData, 'updateUser')
      console.log('sokulResponse', sokulResponse, sokulResponse?.data)
    }
    const fullName = [firstName, middleName, lastName]
    .filter(Boolean)
    .join(' ')
    const formattedDob = dateOfBirth
      ? moment(dateOfBirth, ['MM-DD-YYYY', 'YYYY-MM-DD']).format('YYYY-MM-DD')
      : "";
    const seonKycAmlData = {
      userId: user.userId,
      fullName: fullName,
      firstName: firstName,
      lastName: lastName,
      middleName: middleName,
      dateOfBirth: formattedDob,
      uniqueId: user.uniqueId
    }
    console.log('seonKycAmlData===============', seonKycAmlData)
    await sendSeonKycAmlData({seonKycAmlData})
    return {
      success: true,
      data: data,
      message: SUCCESS_MSG.GET_SUCCESS
    }
  }
}
