import convict from 'convict'
import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'))

  for (const key in envConfig) {
    process.env[key] = envConfig[key]
  }
}

const config = convict({
  app: {
    name: {
      doc: 'Phibet Admin',
      format: String,
      default: 'Phibet Admin'
    }
  },
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'staging', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },

  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 7080,
    env: 'PORT'
  },

  log_level: {
    doc: 'level of logs to show',
    format: String,
    default: 'debug',
    env: 'LOG_LEVEL'
  },

  cors: {
    doc: 'Frontend endpoints to enable for cors setting',
    format: String,
    default: 'http://localhost:3001,',
    env: 'CORS'
  },

  bcrypt: {
    salt: {
      doc: 'Salt var for bcrypt to hash the message',
      format: Number,
      default: 10,
      env: 'BCRYPT_SALT'
    }
  },

  user_backend: {
    endpoint: {
      doc: 'user backend service communication endpoint',
      format: String,
      default: 'http://localhost:8004',
      env: 'USER_BACKEND_ENDPOINT'
    },
    basic_auth: {
      username: {
        doc: 'Basic auth username for user backend service communication',
        format: String,
        default: 'username',
        env: 'USER_BACKEND_BASIC_AUTH_USERNAME'
      },
      password: {
        doc: 'Basic auth password for user backend service communication',
        format: String,
        default: 'password',
        env: 'USER_BACKEND_BASIC_AUTH_PASSWORD'
      }
    }
  },
  internal: {
    basic_auth: {
      username: {
        doc: 'Basic auth username for user backend service communication',
        format: String,
        default: 'username',
        env: 'INTERNAL_BASIC_AUTH_USERNAME'
      },
      password: {
        doc: 'Basic auth password for user backend service communication',
        format: String,
        default: 'password',
        env: 'INTERNAL_BASIC_AUTH_PASSWORD'
      }
    }
  },
  queue_worker: {
    endpoint: {
      doc: 'queue worker service communication endpoint',
      format: String,
      default: 'http://localhost:7080',
      env: 'QUEUE_WORKER_BACKEND_ENDPOINT'
    },
    basic_auth: {
      username: {
        doc: 'Basic auth username for user backend service communication',
        format: String,
        default: 'username',
        env: 'QUEUE_WORKER_BASIC_AUTH_USERNAME'
      },
      password: {
        doc: 'Basic auth password for user backend service communication',
        format: String,
        default: 'password',
        env: 'QUEUE_WORKER_BASIC_AUTH_PASSWORD'
      }
    }
  },
  user_frontend: {
    endpoint: {
      doc: 'user frontend service endpoint',
      format: String,
      default: 'http://localhost:8005',
      env: 'USER_FRONTEND_ENDPOINT'
    }
  },

  super_admin: {
    email: {
      doc: 'Super admin email',
      format: String,
      default: '',
      env: 'SUPER_ADMIN_EMAIL'
    },
    username: {
      doc: 'Super admin username',
      format: String,
      default: '',
      env: 'SUPER_ADMIN_USERNAME'
    },
    password: {
      doc: 'Super admin password',
      format: String,
      default: '',
      env: 'SUPER_ADMIN_PASSWORD'
    }
  },

  db: {
    name: {
      doc: 'Database Name',
      format: String,
      default: 'api',
      env: 'DB_NAME'
    },
    username: {
      doc: 'Database user',
      format: String,
      default: 'postgres',
      env: 'DB_USERNAME'
    },
    password: {
      doc: 'Database password',
      format: '*',
      default: 'postgres',
      env: 'DB_PASSWORD'
    },
    host: {
      doc: 'DB host',
      format: String,
      default: '127.0.0.1',
      env: 'DB_HOST'
    },
    port: {
      doc: 'DB PORT',
      format: 'port',
      default: '5432',
      env: 'DB_PORT'
    },
    logging: {
      doc: 'Database query logging',
      format: Boolean,
      default: false,
      env: 'DB_LOGGING'
    }
  },

  slave_db: {
    name: {
      doc: 'Slave Database Name',
      format: String,
      default: 'api',
      env: 'SLAVE_DB_NAME'
    },
    username: {
      doc: 'Slave Database user',
      format: String,
      default: 'postgres',
      env: 'SLAVE_DB_USERNAME'
    },
    password: {
      doc: 'Slave Database password',
      format: '*',
      default: 'postgres',
      env: 'SLAVE_DB_PASSWORD'
    },
    host: {
      doc: 'Slave DB host',
      format: String,
      default: '127.0.0.1',
      env: 'SLAVE_DB_HOST'
    },
    port: {
      doc: 'Slave DB PORT',
      format: 'port',
      default: '5432',
      env: 'SLAVE_DB_PORT'
    }
  },

  jwt: {
    secret: {
      doc: 'JWT secret key',
      format: String,
      default: 'secret',
      env: 'JWT_SECRET'
    },
    expiry: {
      doc: 'JWT token expiration time',
      format: String,
      default: '2d',
      env: 'JWT_EXPIRY'
    }
  },

  aws: {
    bucket: {
      doc: 'Aws bucket name',
      format: String,
      default: '',
      env: 'AWS_BUCKET'
    },
    region: {
      doc: 'Aws region',
      format: String,
      default: 'us-east-1',
      env: 'AWS_REGION'
    },
    accessKey: {
      doc: 'Aws access key',
      format: String,
      default: '',
      env: 'AWS_ACCESS_KEY'
    },
    secretAccessKey: {
      doc: 'Aws secret access key',
      format: String,
      default: '',
      env: 'AWS_SECRET_ACCESS_KEY'
    }
  },

  redis_db: {
    password: {
      doc: 'Redis Database password',
      format: '*',
      default: '',
      env: 'REDIS_DB_PASSWORD'
    },
    host: {
      doc: 'Redis DB host',
      format: String,
      default: '127.0.0.1',
      env: 'REDIS_DB_HOST'
    },
    port: {
      doc: 'Redis DB PORT',
      format: 'port',
      default: 6379,
      env: 'REDIS_DB_PORT'
    }
  },

  pushNotification: {
    notificationSubject: {
      doc: 'PushNotification subject',
      format: String,
      default: '',
      env: 'PUSH_NOTIFICATION_SUBJECT'
    },
    publicKey: {
      doc: 'PushNotification public key',
      format: String,
      default: '',
      env: 'PUSH_NOTIFICATION_PUBLIC_KEY'
    },
    privateKey: {
      doc: 'PushNotification private key',
      format: String,
      default: '',
      env: 'PUSH_NOTIFICATION_PRIVATE_KEY'
    }
  },
  alea: {
    casino_id: {
      format: String,
      default: '',
      env: 'ALEA_CASINO_ID'
    },
    casino_pp_sc_id: {
      format: String,
      default: '',
      env: 'ALEA_CASINO_PP_SC_ID'
    },
    secret_key: {
      format: String,
      default: '',
      env: 'ALEA_SECRET_KEY'
    },
    base_url: {
      format: String,
      default: '',
      env: 'ALEA_BASE_URL'
    },
    secret_token: {
      format: String,
      default: '',
      env: 'ALEA_SECRET_TOKEN'
    },
    environment_id: {
      format: String,
      default: '',
      env: 'ALEA_ENVIRONMENT_ID'
    },
    pp_environment_id: {
      format: String,
      default: '',
      env: 'ALEA_PP_ENVIRONMENT_ID'
    },
    auth_token: {
      format: String,
      default: '',
      env: 'ALEA_AUTH_TOKEN'
    }
  },
  approvely: {
    publicApiKey: {
      doc: 'public key of approvely',
      format: String,
      default: '',
      env: 'APPROVELY_PUBLIC_KEY'
    },
    privateApiKey: {
      doc: 'private key of approvely',
      format: String,
      default: '',
      env: 'APPROVELY_PRIVATE_KEY'
    },
    url: {
      doc: 'url of approvely',
      format: String,
      default: '',
      env: 'APPROVELY_URL'
    }
  },
  scaleo: {
    base_url: {
      format: String,
      default: '',
      env: 'SCALEO_BASE_URL'
    },
    api_key: {
      format: String,
      default: '',
      env: 'SCALEO_API_KEY'
    }
  },
  idComply: {
    baseUrl: {
      default: '',
      env: 'ID_COMPLY_BASE_URL'
    },
    apiKey: {
      default: '',
      env: 'ID_COMPLY_API_KEY'
    },
    dv_endpoint: {
      default: '',
      env: 'ID_COMPLY_DV_ENDPOINT'
    },
    idpv_endpoint: {
      default: '',
      env: 'ID_COMPLY_IDPV_ENDPOINT'
    },
    redirectUrl: {
      default: '',
      env: 'ID_COMPLY_REDIRECT_URL'
    },
    formBaseUrl: {
      default: '',
      env: 'ID_COMPLY_FORM_BASE_URL'
    }
  }
})
config.validate({ allowed: 'strict' })
export { config }
