import { config } from './config'

export const casinoAggregatorConfig = {
  endpoint: config.get('casino_aggregator.endpoint'),
  basicAuth: {
    username: config.get('casino_aggregator.basic_auth.username'),
    password: config.get('casino_aggregator.basic_auth.password')
  }
}
