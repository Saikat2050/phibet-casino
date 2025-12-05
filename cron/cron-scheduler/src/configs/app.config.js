import { config } from 'src/configs/config'

export const appConfig = {
  app: {
    name: config.get('app.name')
  },
  env: config.get('env'),
  port: config.get('port'),
  jwt: {
    secret: config.get('jwt.secret'),
    expiry: config.get('jwt.expiry')
  },
  cors: config.get('cors').split(',').map(origin => String(origin)),
  logLevel: config.get('log_level'),
  internalBasicAuth: {
    username: config.get('internanl_basic_auth.username'),
    password: config.get('internanl_basic_auth.password')
  }
}
