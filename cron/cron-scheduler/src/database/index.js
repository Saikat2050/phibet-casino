import { databaseOptions } from '@src/configs'
import { addModelsSchemaToAjv } from '@src/helpers/ajv.helper'
import { Logger } from '@src/libs/logger'
import Sequelize from 'sequelize'
import { models } from './models'

/** @type {Sequelize.Sequelize} */
const sequelize = new Sequelize({ ...databaseOptions })

models.forEach(model => {
  model.init(sequelize)
})

models.forEach(model => {
  model.associate(sequelize.models)
})

addModelsSchemaToAjv(models)

sequelize.authenticate().then(() => {
  Logger.info('Database', { message: 'Connected...' })
}).catch(error => {
  Logger.error('Database', { exception: error })
  throw error
})

const databaseCloseFn = sequelize.close.bind(sequelize)

sequelize.close = async () => {
  await databaseCloseFn()
  Logger.error('Database', { message: 'Closed...' })
}

export {
  sequelize
}
