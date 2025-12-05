import convict from 'convict'
import dotenv from 'dotenv'
import fs from 'fs'

if (fs.existsSync('.env')) {
  const envConfig = dotenv.parse(fs.readFileSync('.env'))

  for (const key in envConfig) {
    process.env[key] = envConfig[key]
  }
}
// test
const config = convict({
  app: {
    name: {
      doc: 'Name of the service',
      format: String,
      default: 'vegasCoins-user-backend'
    },
    url: {
      doc: 'URL of the service',
      format: String,
      default: 'user-backend:8003',
      env: 'APP_URL'
    },
    appName: {
      doc: 'Name of the application',
      format: String,
      default: 'SweepStack',
      env: 'APP_NAME'
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
    default: 8080,
    env: 'PORT'
  },

  origin: {
    doc: 'cors origin',
    format: String,
    default: 'true',
    env: 'ORIGIN'
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
    readHost: {
      doc: 'DB read host',
      format: String,
      default: '127.0.0.1',
      env: 'DB_READ_HOST'
    },
    writeHost: {
      doc: 'DB write host',
      format: String,
      default: '127.0.0.1',
      env: 'DB_WRITE_HOST'
    },
    port: {
      doc: 'DB PORT',
      format: 'port',
      default: '5432',
      env: 'DB_PORT'
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

  log_level: {
    doc: 'level of logs to show',
    format: String,
    default: 'debug',
    env: 'LOG_LEVEL'
  },

  jwt: {
    loginTokenSecret: {
      default: '',
      env: 'JWT_LOGIN_SECRET'
    },
    loginTokenExpiry: {
      default: '2d',
      env: 'JWT_LOGIN_TOKEN_EXPIRY'
    },
    verificationTokenSecret: {
      default: '',
      env: 'VERIFICATION_TOKEN_SECRET'
    },
    verificationTokenExpiry: {
      default: '120s',
      env: 'VERIFICATION_TOKEN_EXPIRY'
    },
    secretKey: {
      default: '',
      env: 'SECRET_KEY'
    },
    resetPasswordKey: {
      default: '',
      env: 'RESET_PASSWORD_KEY'
    },
    emailTokenExpiry: {
      default: '1d',
      env: 'EMAIL_TOKEN_EXPIRY'
    },
    emailTokenKey: {
      default: '',
      env: 'EMAIL_TOKEN_KEY'
    },
    resetPasswordExpiry: {
      default: '',
      env: 'RESET_PASSWORD_EXPIRY'
    },
    casinoGamePlayExpiry: {
      default: '',
      env: 'CASINO_GAME_PLAY_EXPIRY'
    },
    casinoGamePlaySecret: {
      default: '',
      env: 'CASINO_GAME_PLAY_SECRET'
    },
    passwordHashKey: {
      default: '',
      env: 'PASSWORD_HASH_SECRET_KEY'
    }
  },

  socket: {
    encryptionKey: {
      default: '',
      env: 'SOCKET_ENCRYPTION_KEY'
    },
    maxPerUserConnection: {
      default: 2,
      env: 'SOCKET_MAX_PER_USER_CONNECTION'
    }
  },

  s3: {
    region: {
      doc: 'Region where s3 located.',
      format: String,
      default: '',
      env: 'S3_REGION'
    },
    bucket: {
      doc: 'Bucket used in S3',
      format: String,
      default: '',
      env: 'S3_BUCKET'
    },
    access_key_id: {
      doc: 'Access key for s3.',
      format: String,
      default: '',
      env: 'S3_ACCESS_KEY_ID'
    },
    secret_access_key: {
      doc: 'Secret key for s3.',
      format: String,
      default: '',
      env: 'S3_SECRET_ACCESS_KEY'
    },
    S3_DOMAIN_KEY_PREFIX: {
      doc: 'S3 domain PREFIX key for s3.',
      format: String,
      default: '',
      env: 'S3_DOMAIN_KEY_PREFIX'
    }
  },

  frontendUrl: {
    doc: 'Frontend Url',
    format: String,
    default: '',
    env: 'FRONTEND_URL'
  },

  adminBeUrl: {
    default: '',
    env: 'ADMIN_BE_URL'
  },

  rate_limit_opt_timewindow: {
    doc: 'rate limit for the otp calling',
    default: 2,
    env: 'RATE_LIMIT_OPT_TIMEWINDOW'
  },

  rate_limit_opt_max_requests: {
    doc: 'rate limit opt max requests for the otp calling',
    default: 5,
    env: 'RATE_LIMIT_OPT_MAX_REQUESTS'
  },

  app_game_name: {
    doc: 'App game name',
    format: String,
    default: 'vegasCoins',
    env: 'APP_GAME_NAME'
  },

  app_game_url: {
    doc: 'App game url',
    format: String,
    default: 'www.vegasCoins.com',
    env: 'APP_GAME_URL'
  },

  google: {
    base_url: {
      doc: 'Google Base Url',
      format: String,
      default: '',
      env: 'GOOGLE_BASE_URL'
    },
    client_id: {
      doc: 'Google client Id',
      format: String,
      default: '',
      env: 'GOOGLE_CLIENT_ID'
    },
    secret_key: {
      doc: 'Google secret key',
      format: String,
      default: '',
      env: 'GOOGLE_CLIENT_SECRET_KEY'
    }
  },

  facebook: {
    app_id: {
      doc: 'facebook app Id',
      format: String,
      default: '',
      env: 'FB_APP_ID'
    },
    secret_key: {
      doc: 'facebook secret key',
      format: String,
      default: '',
      env: 'FB_SECRET_KEY'
    }
  },

  twilio: {
    twilio_account_sid: {
      doc: 'Twilio account SID',
      format: String,
      default: '',
      env: 'TWILIO_ACCOUNT_SID'
    },
    twilio_auth_token: {
      doc: 'Twilio auth token',
      format: String,
      default: '',
      env: 'TWILIO_AUTH_TOKEN'
    },
    twilio_service_sid: {
      doc: 'Twilio service sid',
      format: String,
      default: '',
      env: 'TWILIO_SERVICE_SID'
    }
  },
  send_grid: {
    api_key: {
      doc: 'SendGrid API Key',
      format: String,
      default: '',
      env: 'SEND_GRID_API_KEY'
    },
    base_url: {
      doc: 'SendGrid Base Url',
      format: String,
      default: '',
      env: 'SEND_GRID_BASE_URL'
    },
    sender_email: {
      doc: 'SendGrid Sender Email',
      format: String,
      default: '',
      env: 'SEND_GRID_FROM_EMAIL'
    },
    sender_name: {
      doc: 'SendGrid Sender Name',
      format: String,
      default: '',
      env: 'SEND_GRID_FROM_NAME'
    }
  },
  gsoft: {
    init_vector: {
      doc: '16 byte init vector for encryption',
      format: String,
      default: 'o6oB7Nm7VDYtB5Cw',
      env: 'GSOFT_ENCRYPTION_INIT_VECTOR_16_BYTE'
    },
    security_key: {
      doc: '32 byte security key',
      format: String,
      default: 'lkJwjpT3A3yeSWVT5DkWi770gEo6oB7N',
      env: 'GSOFT_ENCRYPTION_SECUTIRY_KEY_32_BYTE'
    },
    gsoft_sinatra_game_api_url: {
      doc: 'Gsoft Sinatra Games API URLs',
      format: String,
      default: 'https://stgsinatragateway.groovegaming.com',
      env: 'GSOFT_SINATRA_GAME_API_URL'
    },
    gsoft_start_game_api_url: {
      doc: 'Gsoft Start Games API URLs',
      format: String,
      default: 'https://api-stg.xtrtnews.com',
      env: 'GSOFT_START_GAME_API_URL'
    },
    username: {
      doc: 'gsoft account username',
      format: String,
      default: 'nofar2@gmail.com',
      env: 'GSOFT_ACCOUNT_USERNAME'
    },
    password: {
      doc: 'gsoft account password',
      format: String,
      default: 'ddd',
      env: 'GSOFT_ACCOUNT_PASSWORD'
    },
    operator_id: {
      doc: 'gsoft operator ID',
      format: String,
      default: '98765',
      env: 'GSOFT_OPERATOR_ID'
    },
    license: {
      doc: 'GSoft license',
      format: String,
      default: 'Curacao',
      env: 'GSOFT_LICENSE'
    }
  },
  apple: {
    secretKey: {
      format: String,
      default: '',
      env: 'APPLE_SECRET_KEY'
    },
    client_id: {
      format: String,
      default: '',
      env: 'APPLE_CLIENT_ID'
    },
    team_id: {
      format: String,
      default: '',
      env: 'APPLE_TEAM_ID'
    },
    redirect_uri: {
      format: String,
      default: '',
      env: 'APPLE_REDIRECT_URI'
    },
    scope: {
      format: String,
      default: '',
      env: 'APPLE_SCOPE'
    },
    key_id: {
      format: String,
      default: '',
      env: 'APPLE_KEY_ID'
    }
  },
  sumSub: {
    url: {
      format: String,
      default: '',
      env: 'SUM_SUB_URL'
    },
    token: {
      format: String,
      default: '',
      env: 'SUM_SUB_TOKEN'
    },
    secret: {
      format: String,
      default: '',
      env: 'SUM_SUB_SECRET'
    }
  },
  paysafe: {
    base_url: {
      format: String,
      default: '',
      env: 'PAYSAFE_BASE_URL'
    },
    username: {
      format: String,
      default: '',
      env: 'PAYSAFE_API_USERNAME'
    },
    password: {
      format: String,
      default: '',
      env: 'PAYSAFE_API_PASSWORD'
    },
    hmac_secret_card: {
      format: String,
      default: '',
      env: 'PAYSAFE_HMAC_SECRET_CARD'
    },
    hmac_secret_apm: {
      format: String,
      default: '',
      env: 'PAYSAFE_HMAC_SECRET_APM'
    },
    pay_by_bank_account_id: {
      format: String,
      default: '',
      env: 'PAYSAFE_PAY_BY_BANK_ACCOUNT_ID'
    }
  },
  pushcash: {
    api_key: {
      format: String,
      default: '',
      env: 'PUSHCASH_API_KEY'
    },
    base_url: {
      format: String,
      default: '',
      env: 'PUSHCASH_BASE_URL'
    },
    redirect_url: {
      format: String,
      default: '',
      env: 'PUSHCASH_REDIRECT_URL'
    },
    webhook_url: {
      format: String,
      default: '',
      env: 'PUSHCASH_WEBHOOK_URL'
    },
    withdraw_webhook_url: {
      format: String,
      default: '',
      env: 'PUSHCASH_WITHDRAW_WEBHOOK_URL'
    }
  },
  approvely: {
    base_url: {
      format: String,
      default: '',
      env: 'APPROVELY_BASE_URL'
    },
    privateApiKey: {
      format: String,
      default: '',
      env: 'APPROVELY_API_KEY'
    }
  },
  fingerprint: {
    privateKey: {
      default: '',
      format: String,
      env: 'FINGERPRINT_PRIVATE_KEY'
    }
  },
  finix: {
    username: {
      default: '',
      format: String,
      env: 'FINIX_USERNAME'
    },
    password: {
      default: '',
      format: String,
      env: 'FINIX_PASSWORD'
    },
    url: {
      default: '',
      format: String,
      env: 'FINIX_URL'
    },
    merchantId: {
      default: '',
      format: String,
      env: 'FINIX_MERCHANT_ID'
    },
    apple_pay_session_base_url: {
      default: '',
      format: String,
      env: 'APPLE_PAY_SESSION_BASE_URL'
    },
    apple_pay_session_endpoint: {
      default: '',
      format: String,
      env: 'APPLE_PAY_SESSION_ENDPOINT'
    },
    merchant_api: {
      default: '',
      format: String,
      env: 'APPLE_PAY_MERCHANT_BASE_URL'
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
  sokul: {
    base_url: {
      format: String,
      default: '',
      env: 'SOKUL_BASE_URL'
    },
    api_key: {
      format: String,
      default: '',
      env: 'SOKUL_API_KEY'
    }
  },
  seon: {
    api_key: {
      format: String,
      default: '',
      env: 'SEON_API_KEY'
    },
    base_url: {
      format: String,
      default: '',
      env: 'SEON_BASE_URL'
    },
    api_license_key: {
      format: String,
      default: '',
      env: 'SEON_API_LICENSE_KEY'
    }
  },
  beterLive: {
    casino: {
      format: String,
      default: '',
      env: 'BETER_CASINO'
    },
    secret_key: {
      format: String,
      default: '',
      env: 'BETER_SECRET_KEY'
    },
    base_url: {
      format: String,
      default: '',
      env: 'BETER_BASE_URL'
    }
  },
  tinyrex: {
    casino: {
      format: String,
      default: '',
      env: 'TINYREX_CASINO'
    },
    base_url: {
      format: String,
      default: '',
      env: 'TINYREX_BASE_URL'
    },
    operator_id: {
      format: String,
      default: '',
      env: 'TINYREX_OPERATOR_ID'
    }
  },
  boomingConfig: {
    boomingGameUrl: {
      default: '',
      env: 'BOOMING_GAME_URL'
    },
    boomingApiKey: {
      default: '',
      env: 'BOOMING_API_KEY'
    },
    boomingApiSecret: {
      default: '',
      env: 'BOOMING_API_SECRET'
    },
    boomingRequestPath: {
      default: '',
      env: 'BOOMING_REQUEST_PATH'
    },
    launchUrl: {
      default: '',
      env: 'LAUNCH_URL'
    },
    boomingCallback: {
      default: '',
      env: 'BOOMING_CALLBACK'
    },
    boomingRollBackCallback: {
      default: '',
      env: 'BOOMING_CALLBACK_ROLLBACK'
    }
  },
  crypto: {
    secret: {
      default: '',
      env: 'CRYPTO_SECRET_KEY'
    },
    cbc: {
      default: '',
      env: 'CRYPTO_CBC_IV'
    }
  },
  ipWhitelist: {
    doc: 'Comma-separated list of whitelisted IP addresses',
    format: String,
    default: '',
    env: 'IP_WHITELIST'
  }
})

config.validate({ allowed: 'strict' })

export default config
