import * as Sentry from '@sentry/node'
import { nodeProfilingIntegration } from '@sentry/profiling-node'
import config from './src/configs/app.config'

if (config.get('env') === 'production' || config.get('env') === 'staging') {
  Sentry.init({
  dsn: 'https://443876b02b1cde84765b39ac6cc74391@o4509037889126400.ingest.us.sentry.io/4509038421934080',
  environment: config.get('env'),
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 0.02,  // 2%
  profilesSampleRate: 1.0,  // 2% * 1.0 = 2%
  sendDefaultPii: true
  })
}
