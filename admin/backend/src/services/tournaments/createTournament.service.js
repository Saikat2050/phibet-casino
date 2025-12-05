import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
// import { QueueWorkerAxios } from '@src/libs/axios/queueWorker.axios'
import { dayjs } from '@src/libs/dayjs'
import { uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { STATUS } from '@src/utils/constants/casinoTournament.constants'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    image: { type: 'object' },
    creditPoints: { type: 'number' },
    currencyDetails: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          entryFees: { type: 'number' },
          currencyId: { type: 'string' },
          rebuyFees: { type: 'number' },
          rebuyLimit: { type: 'number' },
          poolPrize: { type: 'number' },
          maxPlayerLimit: { type: 'number' },
          minPlayerLimit: { type: 'number' },
          prizes: { type: 'array' }
        },
        required: ['currencyId', 'entryFees'],
        additionalProperties: false
      }
    },
    name: { type: 'object' },
    description: { type: 'object' },
    prizes: { type: 'array' },
    tagIds: { type: 'array' },
    casinoGameIds: { type: 'array' },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
    registrationEndDate: { type: 'string', format: 'date-time' }
  },
  required: ['name', 'description', 'startDate', 'endDate', 'registrationEndDate', 'currencyDetails']
})

export class CreateTournamentService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    /** @type {Express.Multer.File} */
    const transaction = this.context.sequelizeTransaction
    const prizeData = []
    try {
      const startDate = dayjs(this.args.startDate).utc().format()
      const endDate = dayjs(this.args.endDate).utc().format()
      const tournamentImage = this.args.image
      const registrationEndDate = dayjs(this.args.registrationEndDate).utc().format()
      let casinoGameIds = this.args.casinoGameIds
      if (!(startDate <= endDate || registrationEndDate >= startDate)) return this.addError('InvalidDateErrorType')
      if (await this.context.sequelize.models.casinoTournament.findOne({ where: { 'name.EN': this.args.name.EN } })) return this.addError('TournamentExistsErrorType')

      const tournament = await this.context.sequelize.models.casinoTournament.create({
        startDate,
        endDate,
        registrationEndDate,
        status: STATUS.ACTIVE,
        tagIds: this.args.tagIds,
        name: await getLanguageWiseNameJson(this.args.name),
        description: await getLanguageWiseNameJson(this.args.description),
        creditPoints: this.args.creditPoints
      }, { transaction })

      casinoGameIds = casinoGameIds.map(casinoGameId => ({
        casinoGameId,
        tournamentId: tournament.id
      }))

      const currencyDetails = await Promise.all(this.args.currencyDetails.map(async (currency) => {
        if (await this.context.sequelize.models.currency.findOne({ where: { id: currency.currencyId } })) {
          if (currency.minPlayerLimit > currency.maxPlayerLimit) return this.addError('LimitDoesNotExistsErrorType')
          currency.tournamentId = tournament.id
          const prizes = currency.prizes
          const tournamentCurrency = await this.context.sequelize.models.tournamentCurrency.create(currency, { transaction })
          for (const prize of prizes) {
            prizeData.push({
              ...prize,
              tournamentId: tournament.id,
              tournamentCurrencyId: tournamentCurrency.id
            })
          }
          return currency
        }
        return null
      }))
      if (_.includes(currencyDetails, null)) return this.addError('InvalidCurrencyDetailsErrorType')

      await this.context.sequelize.models.casinoTournamentGame.bulkCreate(casinoGameIds, { transaction })
      await this.context.sequelize.models.tournamentPrize.bulkCreate(prizeData, { transaction })
      if (tournamentImage) {
        const fileLocation = await uploadFile(tournamentImage.buffer, {
          name: tournamentImage.originalname,
          mimetype: tournamentImage.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.tournament
        })
        tournament.image = fileLocation
        await tournament.save({ transaction })
      }

      // await QueueWorkerAxios.scheduleJobs(tournament.id, tournament.registrationEndDate, tournament.endDate)
      return { tournament, messages: 'Tournament created successfully' }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
