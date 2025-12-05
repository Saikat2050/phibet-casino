import { config } from '@src/configs/config'
import { Logger } from '@src/libs/logger'
import axios from 'axios'

export async function trackScaleoEvent (payload) {
  const scaleoURL = config.get('scaleo.base_url')
  const apiKey = config.get('scaleo.api_key')
  if (!scaleoURL || !apiKey) return false
  const url = `${scaleoURL}/api/v2/network/tracking/event?api-key=${apiKey}`
  const data = { ...payload }

  try {
    const response = await axios.post(url, data)
    Logger.info(`Scaleo response Data - ${JSON.stringify(response.data)}`)

    return true
  } catch (error) {
    Logger.error(`Error in Scaleo event - ${error}`)
    return false
  }
}
