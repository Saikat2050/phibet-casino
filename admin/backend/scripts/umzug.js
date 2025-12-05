// export {migrator}
const { migrator, seeder } = require('@src/helpers/migration.helper')
const { Logger } = require('@src/libs/logger')

if (process.argv[2] === 'migrations') {
  migrator.up().then(() => { Logger.info('Migration done') }).catch(err => { Logger.error(err) })
}
if (process.argv[2] === 'seeders') {
  seeder.up().then(() => { Logger.info('Data seeded') }).catch(err => { Logger.error(err) })
}
