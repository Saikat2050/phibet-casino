import { appConfig } from '@src/configs'
import { Axios } from 'axios'

export class UserBackendAxios extends Axios {
  constructor () {
    super({
      baseURL: `${appConfig.userBackend.endpoint}/api/v1/internal`,
      auth: {
        username: appConfig.userBackend.basicAuth.username,
        password: appConfig.userBackend.basicAuth.password
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  /**
   * @param {string} email
   * @returns
   */
  static async sendResetPasswordEmail (email) {
    try {
      const userBackendAxios = new UserBackendAxios()
      const response = await userBackendAxios.post('/send-reset-password-email', JSON.stringify({ email }))
      const data = JSON.parse(response.data)
      if (response.status !== 200) throw data.errors

      return data?.data?.emailSent || true
    } catch (error) {
      throw Error('ServiceUnavailableErrorType')
    }
  }
}
