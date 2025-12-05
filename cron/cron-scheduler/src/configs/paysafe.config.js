import { config } from './config'

export const paysafe = {
  baseUrl: config.get('payment.paysafe.base_url'),
  username: config.get('payment.paysafe.username'),
  password: config.get('payment.paysafe.password'),
  paysafePayByBankAccountId: config.get('payment.paysafe.pay_by_bank_account_id')
}
