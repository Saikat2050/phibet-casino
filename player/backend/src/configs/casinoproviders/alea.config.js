import { config } from '../config'

export const aleaCasinoConfig = {
  casinoId: config.get('alea.casino_id'),
  casinoPpScId: config.get('alea.casino_pp_sc_id'),
  secretKey: config.get('alea.secret_key'),
  url: config.get('alea.base_url'),
  secretToken: config.get('alea.secret_token'),
  environmentId: config.get('alea.environment_id'),
  ppEnvironmentId: config.get('alea.pp_environment_id')
}
