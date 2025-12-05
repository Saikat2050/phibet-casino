import { FingerprintJsServerApiClient, Region } from '@fingerprintjs/fingerprintjs-pro-server-api'
import config from '../configs/app.config'

export const fingerprintClient = new FingerprintJsServerApiClient
({
  apiKey: config.get('fingerprint.privateKey'),
  region: Region.Global,
})