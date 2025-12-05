import { config } from '@src/configs/config'

export const paysafePaymentGateWay = {
  username: config.get('paysafe.username'),
  password: config.get('paysafe.password'),
  baseUrl: config.get('paysafe.baseUrl'),
  payByBankAccountId: config.get('paysafe.payByBankAccountId')
}
