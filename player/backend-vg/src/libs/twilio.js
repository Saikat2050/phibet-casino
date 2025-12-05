import config from '../configs/app.config'

const twilioConfig = config.getProperties().twilio

const accountSid = `${twilioConfig.twilio_account_sid}`
const authToken = `${twilioConfig.twilio_auth_token}`
const serviceSid = `${twilioConfig.twilio_service_sid}`
const client = require('twilio')(accountSid, authToken)

export const sendOTP = async ({ phone, phoneCode = 1 }) => {
  try {
    const phoneNumber = await client.lookups.v2
      .phoneNumbers(`+${phoneCode}${phone}`)
      .fetch({ fields: 'line_type_intelligence' })

    if (phoneNumber?.lineTypeIntelligence?.type !== 'mobile') {
      return 'InvalidPhoneOrCodeErrorType'
    }

    client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: `+${phoneCode}${phone}`, channel: 'sms' })

    return true
  } catch (error) {
    if (error.message === 'Max send attempts reached') return 'MaxAttempts'
    console.log('Error while sending message ', error)
    return false
  }
}

export const verifyOTP = async ({ phone, phoneCode = 1, otp }) => {
  try {
    const verificationChecks = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: `+${phoneCode}${phone}`, code: otp })

    return verificationChecks.status
  } catch (error) {
    console.log('Error', error)
    return false
  }
}
