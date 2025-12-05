import { config } from './config'

export const idComply = {
  baseUrl: config.get('idComply.baseUrl'),
  apiKey: config.get('idComply.apiKey'),
  dvEndpoint: config.get('idComply.dv_endpoint'),
  idpvEndpoint: config.get('idComply.idpv_endpoint'),
  redirectUrl: config.get('idComply.redirectUrl'),
  formBaseUrl: config.get('idComply.formBaseUrl')
}
