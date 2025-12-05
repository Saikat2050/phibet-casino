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
      doc: 'Name of the service',
      format: String,
      default: 'queue worker'
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

  cors: {
    doc: 'Frontend endpoints to enable for cors setting',
    format: String,
    default: 'http://localhost:3000',
    env: 'CORS'
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
      default: true,
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

  pub_sub_redis_db: {
    password: {
      doc: 'Redis Database password',
      format: '*',
      default: '',
      env: 'PUB_SUB_REDIS_DB_PASSWORD'
    },
    host: {
      doc: 'Redis DB host',
      format: String,
      default: '127.0.0.1',
      env: 'PUB_SUB_REDIS_DB_HOST'
    },
    port: {
      doc: 'Redis DB PORT',
      format: 'port',
      default: 6379,
      env: 'PUB_SUB_REDIS_DB_PORT'
    }
  },

  queue_worker_redis_db: {
    password: {
      doc: 'Redis Database password',
      format: '*',
      default: '',
      env: 'QUEUE_WORKER_REDIS_DB_PASSWORD'
    },
    host: {
      doc: 'Redis DB host',
      format: String,
      default: '127.0.0.1',
      env: 'QUEUE_WORKER_REDIS_DB_HOST'
    },
    port: {
      doc: 'Redis DB PORT',
      format: 'port',
      default: 6379,
      env: 'QUEUE_WORKER_REDIS_DB_PORT'
    }
  },

  log_level: {
    doc: 'level of logs to show',
    format: String,
    default: 'debug',
    env: 'LOG_LEVEL'
  },

  payment: {
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
      pay_by_bank_account_id: {
        format: String,
        default: '',
        env: 'PAYSAFE_PAY_BY_BANK_ACCOUNT_ID'
      }
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
  optimove: {
    host: {
      doc: 'Optimove Sftp host',
      format: String,
      default: '',
      env: 'OPTIMOVE_SFTP_HOST'
    },
    port: {
      doc: 'Optimove Sftp Port',
      format: 'port',
      default: 22,
      env: 'OPTIMOVE_SFTP_PORT'
    },
    user: {
      doc: 'Optimove Sftp user',
      format: String,
      default: '',
      env: 'OPTIMOVE_SFTP_USER'
    },
    password: {
      doc: 'Optimove Sftp password',
      format: String,
      default: '',
      env: 'OPTIMOVE_SFTP_PASSWORD'
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
    }
  }
})

config.validate({ allowed: 'strict' })

export { config }
