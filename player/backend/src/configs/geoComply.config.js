import { config } from './config'

export const geoComply = {
  licenseAPI: config.get('geoComply.licenseAPI'),
  licenseAPIKey: config.get('geoComply.licenseAPIKey'),
  licenseSecretKey: config.get('geoComply.licenseSecretKey'),
  decryptionKey: config.get('geoComply.decryptionKey'),
  decryptionIV: config.get('geoComply.decryptionIV')
}
