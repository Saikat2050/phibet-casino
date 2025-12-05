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
      doc: 'User backend',
      format: String,
      default: 'User backend'
    },
    userFeUrl: {
      doc: 'User Frontend Url',
      format: String,
      default: 'User Frontend Url',
      env: 'USER_FE_URL'
    },
    userBeUrl: {
      doc: 'User Backend Url',
      format: String,
      default: 'User Backend Url',
      env: 'USER_BE_URL'
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
    default: 4000,
    env: 'PORT'
  },

  log_level: {
    doc: 'level of logs to show',
    format: String,
    default: 'debug',
    env: 'LOG_LEVEL'
  },

  internanl_basic_auth: {
    username: {
      doc: 'Basic auth username for internal service communication',
      format: String,
      default: 'username',
      env: 'INTERNAL_BASIC_AUTH_USERNAME'
    },
    password: {
      doc: 'Basic auth password for internal service communication',
      format: String,
      default: 'password',
      env: 'INTERNAL_BASIC_AUTH_PASSWORD'
    }
  },

  session: {
    secret: {
      doc: 'Session secret',
      format: String,
      default: 'secret',
      env: 'SESSION_SECRET'
    },
    expiry: {
      doc: 'Global session expiry time in milliseconds',
      format: Number,
      default: '172800000', // 2 days
      env: 'SESSION_EXPIRY'
    }
  },

  bcrypt: {
    salt: {
      doc: 'Salt var for bcrypt to hash the message',
      format: Number,
      default: 10,
      env: 'BCRYPT_SALT'
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
      default: 'redis-database',
      env: 'REDIS_DB_HOST'
    },
    port: {
      doc: 'Redis DB PORT',
      format: 'port',
      default: 6379,
      env: 'REDIS_DB_PORT'
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
    },
    emailVerificationExpiry: {
      doc: 'Email verification token expiration time',
      format: String,
      default: '5m',
      env: 'JWT_EMAIL_VERIFICATION_EXPIRY'
    },
    passwordHashKey: {
      doc: 'SEON PASSWORD HASH KEY',
      format: String,
      default: '',
      env: 'PASSWORD_HASH_SECRET_KEY'
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
      default: 'us-east-',
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

  cors: {
    doc: 'Frontend endpoints to enable for cors setting',
    format: String,
    default: 'http://localhost:3000, ',
    env: 'CORS'
  },

  casino_aggregator: {
    endpoint: {
      doc: 'Casino Aggregator endpoint',
      format: String,
      default: 'http://localhost:8080, ',
      env: 'CASINO_AGGREGATOR_ENDPOINT'
    },
    basic_auth: {
      username: {
        doc: 'Basic auth username for casino aggregator service communication',
        format: String,
        default: 'username',
        env: 'CASINO_AGGREGATOR_BASIC_AUTH_USERNAME'
      },
      password: {
        doc: 'Basic auth password for casino aggregator service communication',
        format: String,
        default: 'password',
        env: 'CASINO_AGGREGATOR_BASIC_AUTH_PASSWORD'
      }
    }
  },

  mailjet: {
    apiKey: {
      doc: 'Mailjet API key',
      format: String,
      default: '',
      env: 'MAILJET_API_KEY'
    },
    secretKey: {
      doc: 'Mailjet secret key',
      format: String,
      default: '',
      env: 'MAILJET_SECRET_KEY'
    },
    senderEmail: {
      doc: 'Mailjet sender email',
      format: String,
      default: '',
      env: 'MAILJET_SENDER_EMAIL'
    },
    senderName: {
      doc: 'Mailjet sender name',
      format: String,
      default: '',
      env: 'MAILJET_SENDER_NAME'
    }
  },

  paysafe: {
    username: {
      doc: 'Paysafe Username',
      format: String,
      default: '',
      env: 'PAYSAFE_USERNAME'
    },
    password: {
      doc: 'Paysafe Password',
      format: String,
      default: '',
      env: 'PAYSAFE_PASSWORD'
    },
    baseUrl: {
      doc: 'Paysafe Base Url',
      format: String,
      default: '',
      env: 'PAYSAFE_BASE_URL'
    },
    payByBankAccountId: {
      doc: 'Paysafe Account Id',
      format: String,
      default: '',
      env: 'PAYSAFE_PAYBYBANK_ACCOUNT_ID'
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
    },
    webhookValidationKey: {
      doc: 'webhook Validation Key of approvely',
      format: String,
      default: '',
      env: 'APPROVELY_WEBHOOK_VALIDATION_KEY'
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
    }
  },
  shufti: {
    url: {
      doc: 'Shufti URL',
      format: String,
      default: '',
      env: 'SHUFTI_URL'
    },
    clientId: {
      doc: 'Shufti client ID',
      format: String,
      default: '',
      env: 'SHUFTI_CLIENT_ID'
    },
    secretKey: {
      doc: 'Shufti secret key',
      format: String,
      default: '',
      env: 'SHUFTI_SECRET_KEY'
    }
  },
  jobScheduler: {
    url: {
      format: String,
      default: '',
      env: 'JOB_SCHEDULER_URL'
    },
    username: {
      format: String,
      default: '',
      env: 'JOB_SCHEDULER_USERNAME'
    },
    password: {
      format: String,
      default: '',
      env: 'JOB_SCHEDULER_PASSWORD'
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
  sendgrid: {
    apiKey: {
      format: String,
      default: '',
      env: 'SENDGRID_API_KEY'
    },
    baseUrl: {
      format: String,
      default: '',
      env: 'SENDGRID_BASE_URL'
    },
    emailTemplateId: {
      format: String,
      default: '',
      env: 'SENDGRID_EMAIL_TEMPLATE_ID'
    },
    passwordTemplateId: {
      format: String,
      default: '',
      env: 'SENDGRID_PASSWORD_TEMPLATE_ID'
    }
  },
  geoComply: {
    decryptionKey: {
      default: '',
      env: 'GEOCOMPLY_DECRYTION_KEY'
    },
    decryptionIV: {
      default: '',
      env: 'GEOCOMPLY_DECRYTION_IV'
    },
    licenseAPI: {
      default: '',
      env: 'GEOCOMPLY_GET_LICENSE_API'
    },
    licenseSecretKey: {
      default: '',
      env: 'GEOCOMPLY_LICENSE_SECRET_KEY'
    },
    licenseAPIKey: {
      default: '',
      env: 'GEOCOMPLY_LICENSE_API_KEY'
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
  },
  iconic21: {
    casino: {
      format: String,
      default: '',
      env: 'ICONIC_CASINO'
    },
    secret_key: {
      format: String,
      default: '',
      env: 'ICONIC_SECRET_KEY'
    },
    base_url: {
      format: String,
      default: '',
      env: 'ICONIC_BASE_URL'
    },
    brand: {
      format: String,
      default: '',
      env: 'ICONIC_BRAND'
    }
  }
})

config.validate({ allowed: 'strict' })

export { config }
