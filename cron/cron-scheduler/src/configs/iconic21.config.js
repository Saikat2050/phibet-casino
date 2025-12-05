import { config } from './config'
export const iconic21CasinoConfig = {
  casino: config.get('iconic21.casino'),
  secretKey: config.get('iconic21.secret_key'),
  baseUrl: config.get('iconic21.base_url')
}
