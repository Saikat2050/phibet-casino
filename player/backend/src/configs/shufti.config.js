import { config } from './config'

export const shuftiKyc = {
  url: config.get('shufti.url'),
  clientId: config.get('shufti.clientId'),
  secretKey: config.get('shufti.secretKey')
}
