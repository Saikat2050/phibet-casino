const { Logger } = require('@src/libs/logger')
const { config } = require('./config')

const commonSetting = {
  dialect: 'postgres',
  database: config.get('db.name'),
  logging: config.get('db.logging') ? (logs) => Logger.info('Database query', { message: logs }) : false,
  replication: {
    read: [{
      username: config.get('slave_db.username'),
      password: config.get('slave_db.password'),
      host: config.get('slave_db.host'),
      port: config.get('slave_db.port')
    }],
    write: {
      username: config.get('db.username'),
      password: config.get('db.password'),
      host: config.get('db.host'),
      port: config.get('db.port')
    }
  },
  dialectOptions: {
    application_name: config.get('app.name')
  },
  define: {
    underscored: true,
    timestamps: true
  },
  pool: {
    max: 50,
    min: 0,
    idle: 5000,
    evict: 5000,
    acquire: 200000
  },
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'sequelize_migration_meta',
  seederStorage: 'sequelize',
  seederStorageTableName: 'sequelize_seed_meta'
}

module.exports = {
  development: commonSetting,
  staging: commonSetting,
  production: commonSetting
}
