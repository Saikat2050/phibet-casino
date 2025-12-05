import { config } from './config'

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
  userBackend: {
    endpoint: config.get('user_backend.endpoint'),
    basicAuth: {
      username: config.get('user_backend.basic_auth.username'),
      password: config.get('user_backend.basic_auth.password')
    }
  },
  internal: {
    basicAuth: {
      username: config.get('internal.basic_auth.username'),
      password: config.get('internal.basic_auth.password')
    }
  },
  queueWorker: {
    endpoint: config.get('queue_worker.endpoint'),
    basicAuth: {
      username: config.get('queue_worker.basic_auth.username'),
      password: config.get('queue_worker.basic_auth.password')
    }
  },
  userFrontend: {
    endpoint: config.get('user_frontend.endpoint')
  },
  logLevel: config.get('log_level'),
  bcrypt: {
    salt: config.get('bcrypt.salt')
  },
  cors: config.get('cors').split(',').map(origin => String(origin)),
  aws: {
    bucket: config.get('aws.bucket'),
    region: config.get('aws.region'),
    accessKey: config.get('aws.accessKey'),
    secretAccessKey: config.get('aws.secretAccessKey')
  },
  superAdmin: {
    email: config.get('super_admin.email'),
    password: config.get('super_admin.password'),
    username: config.get('super_admin.username')
  },
  pushNotificationKeys: {
    subject: config.get('pushNotification.notificationSubject'),
    privateKey: config.get('pushNotification.privateKey'),
    publicKey: config.get('pushNotification.publicKey')
  }
}
