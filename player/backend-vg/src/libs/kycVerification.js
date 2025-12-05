import axios from 'axios'
import config from '../configs/app.config'
import crypto from 'crypto'
import FormData from 'form-data'
import Logger from './logger'

// Signature creation
export const createSignature = ({ method, url, header = null, data = null }) => {
  try {
    Logger.info('Creating a signature for the request...')

    const timeStamp = Math.floor(Date.now() / 1000)
    const signature = crypto.createHmac('sha256', config.get('kycVerification.sumsubSecretKey'))
    signature.update(timeStamp + method.toUpperCase() + url)

    if (data instanceof FormData) {
      signature.update(data.getBuffer())
    } else if (data) {
      signature.update(data)
    }

    const axiosConfig = {
      method: method,
      url: `${config.get('kycVerification.baseApiUrl')}${url}`,
      headers: {
        'X-App-Token': config.get('kycVerification.sumsubAppToken'),
        'X-App-Access-Sig': signature.digest('hex'),
        Accept: 'application/json',
        'X-App-Access-Ts': `${timeStamp}`
      }
    }

    if (header) {
      axiosConfig.headers = { ...axiosConfig.headers, ...header }
    }

    if (data) {
      axiosConfig.data = data
    }

    return axiosConfig
  } catch (error) {
    Logger.error('Error while creating signature', error)
  }
}

// To create access token for WEBSDK
export const createAccessToken = async ({ externalUserId, levelName, ttlInSecs = 1200 }) => {
  Logger.info('Creating an access token for initializng SDK...')

  const method = 'post'
  const url = `/resources/accessTokens?userId=${externalUserId}&levelName=${levelName}&ttlInSecs=${ttlInSecs}`

  try {
    const response = await axios(createSignature({ method, url }))
    return response.data
  } catch (error) {
    Logger.error('Error in access token creation', error)
  }
}
