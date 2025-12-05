import { config } from './config'

export const appConfig = {
  app: {
    name: config.get('app.name'),
    userFeUrl: config.get('app.userFeUrl'),
    userBeUrl: config.get('app.userBeUrl')
  },
  env: config.get('env'),
  port: config.get('port'),
  jwt: {
    secret: config.get('jwt.secret'),
    expiry: config.get('jwt.expiry'),
    emailVerificationExpiry: config.get('jwt.emailVerificationExpiry')
  },
  internalBasicAuth: {
    username: config.get('internanl_basic_auth.username'),
    password: config.get('internanl_basic_auth.password')
  },
  logLevel: config.get('log_level'),
  bcrypt: {
    salt: config.get('bcrypt.salt')
  },
  session: {
    secret: config.get('session.secret'),
    expiry: config.get('session.expiry')
  },
  cors: config.get('cors').split(',').map(origin => String(origin)),
  aws: {
    bucket: config.get('aws.bucket'),
    region: config.get('aws.region'),
    accessKey: config.get('aws.accessKey'),
    secretAccessKey: config.get('aws.secretAccessKey')
  },
  jobScheduler: {
    jobSchedulerUrl: config.get('jobScheduler.url'),
    jobSchedulerUsername: config.get('jobScheduler.username'),
    jobSchedulerPassword: config.get('jobScheduler.password')
  }
}
