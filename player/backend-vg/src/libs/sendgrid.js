import axios from 'axios'
import config from '../configs/app.config'
import { EMAIL_TEMPLATES } from '../utils/constants/constant'
import { InternalServerErrorType } from '../utils/constants/errors'

const {
  api_key: apiKey,
  base_url: baseUrl,
  sender_email: senderEmail,
  sender_name: senderName
} = config.getProperties().send_grid

export const sendMail = async ({ email, dynamicData, emailTemplate, token }) => {
  if (!emailTemplate.templateId) return 'InternalServerErrorType'

  const frontendHost = config.get().frontendUrl || 'http://127.0.01'

  let verificationLink
  switch (emailTemplate.templateId) {
    case EMAIL_TEMPLATES.FORGET_PASSWORD.templateId:
      verificationLink = `${frontendHost}/user/forgotPassword?token=${token}`
      break
    case EMAIL_TEMPLATES.VERIFY_FORGET_PASSWORD.templateId:
      verificationLink = `${frontendHost}/user/verifyForgetPassword?token=${token}`
      break
    default:
      break
  }

  const options = {
    url: baseUrl,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`
    },
    data: {
      from: { email: senderEmail, name: senderName },
      personalizations: [
        {
          to: [{ email }],
          dynamic_template_data: { ...dynamicData, verificationLink }
        }
      ],
      template_id: emailTemplate.templateId
    }
  }
  try {
    await axios(options)
  } catch (error) {
    console.log(`Error while sending mail to ${email}, more information is ${options}`, error)
    throw InternalServerErrorType
  }
}
