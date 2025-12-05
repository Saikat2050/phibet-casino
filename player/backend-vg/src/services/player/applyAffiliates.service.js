import axios from 'axios'
import ServiceBase from '../serviceBase'
import config from '../../configs/app.config'
import { generateRandomCode } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'

export default class ApplyAffiliateService extends ServiceBase {
  async run () {
    const {
      firstName,
      lastName,
      email,
      phoneCode,
      phone,
      state,
      preferredContact,
      trafficSource,
      plan,
      isTermsAccepted
    } = this.args

    if (!isTermsAccepted) return this.addError('TermsAndConditionErrorType')

    const password = generateRandomCode(10)

    const options = {
      url: `${config.get('scaleo.base_url')}/api/v2/network/affiliates`,
      method: 'POST',
      params: {
        'api-key': config.get('scaleo.api_key')
      },
      data: {
        email: email.toLowerCase().replace(/\+(.*?)@/g, '@'),
        firstname: firstName,
        lastname: lastName,
        password: password.charAt(0).toUpperCase() + '#' + password.slice(1).toLowerCase(),
        phone: `${phoneCode} ${phone}`,
        region: state,
        status: 2, // Pending,
        account_type: 1,
        custom_fields: JSON.stringify({
          custom_field_6927: preferredContact,
          custom_field_7160: trafficSource,
          custom_field_9495: plan
        })
      }
    }

    try {
      await axios(options)
    } catch (error) {
      console.log(error.response)
      if (error.response.data.code === 422) {
        return this.addError('EmailExistErrorType')
      }
      return { error: error?.response?.data }
    }

    return {
      success: true,
      message: SUCCESS_MSG.CREATE_SUCCESS
    }
  }
}
