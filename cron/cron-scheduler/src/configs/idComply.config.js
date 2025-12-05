import { config } from './config'

export const idComply = {
  baseUrl: config.get('idComply.baseUrl'),
  apiKey: config.get('idComply.apiKey')
}
