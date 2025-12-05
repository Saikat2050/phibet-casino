import { config } from '@src/configs/config'

export const approvelyPaymentGateWay = {
  privateApiKey: config.get('approvely.privateApiKey'),
  publicApiKey: config.get('approvely.publicApiKey'),
  url: config.get('approvely.url'),
  webhookValidationKey: config.get('approvely.webhookValidationKey')
}
