import { databaseOptions } from '@src/configs'
import { sequelize } from '@src/database/models'
import { migrationsTimestamp } from '@src/helpers/common.helper'
import { Logger } from '@src/libs/logger'
import path from 'path'
import { DataTypes } from 'sequelize'
import { SequelizeStorage, Umzug } from 'umzug'

/**
 * Run migrations or seeds using Umzug.
 * @param {string} tableName Storage table name for metadata
 * @param {string} modelName Storage table name for metadata
 * @param {string} migrationPath Path to migrations or seeds
 */
function runOperations (tableName, modelName, migrationPath) {
  try {
    const model = sequelize.define(
      tableName,
      {
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          primaryKey: true
        }
      },
      {
        schema: 'public',
        modelName: modelName,
        underscored: true,
        timestamps: false
      }
    )
    const parent = new Umzug({
      migrations: {
        glob: path.join(__dirname, migrationPath),
        resolve: ({ name, path }) => {
          const migration = require(path)
          return {
            name,
            up: async () => migration.up(sequelize.getQueryInterface(), DataTypes),
            down: async () => migration.down(sequelize.getQueryInterface(), DataTypes)
          }
        }
      },
      context: {
        connection: sequelize.getQueryInterface()
      },
      storage: new SequelizeStorage({ tableName, model })
    })

    const umzug = new Umzug({
      ...parent.options,
      migrations: async ctx =>
        (await parent.migrations())
          .filter(file => file.name !== 'index.js')
          .sort((a, b) => migrationsTimestamp(a.name) - migrationsTimestamp(b.name))
    })

    return umzug
  } catch (error) {
    Logger.error('Error', error)
    throw error
  }
}

export const migrator = runOperations('SequelizeMigrationMeta', databaseOptions.migrationStorageTableName, '../database/migrations/**/*.js')
export const seeder = runOperations('SequelizeSeedMeta', databaseOptions.seederStorageTableName, '../database/seeders/**/*.js')
