import { APIError } from '@src/errors/api.error'
import { getLanguageWiseNameJson } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { dayjs } from '@src/libs/dayjs'
import { deleteFile, uploadFile } from '@src/libs/s3'
import { ServiceBase } from '@src/libs/serviceBase'
import { S3FolderHierarchy } from '@src/utils/constants/app.constants'
import { STATUS } from '@src/utils/constants/casinoTournament.constants'
import _ from 'lodash'

const constraints = ajv.compile({
  type: 'object',
  properties: {
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
          prizes: { type: 'array' },
          minPlayerLimit: { type: 'number', minimum: 1 }
        },
        required: ['currencyId', 'entryFees'],
        additionalProperties: false
      }
    },
    tournamentId: { type: 'number' },
    image: { type: 'object' },
    creditPoints: { type: 'number' },
    name: { type: 'object' },
    description: { type: 'object' },
    casinoGameIds: { type: 'array' },
    tagIds: { type: 'array' },
    startDate: { type: 'string', format: 'date-time' },
    endDate: { type: 'string', format: 'date-time' },
    registrationEndDate: { type: 'string', format: 'date-time' }
  },
  required: ['tournamentId']
})

export class UpdateTournamentsService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const tournamentId = this.args.tournamentId
    const tournamentImage = this.args.image
    const startDate = dayjs(this.args.startDate).utc().format()
    const endDate = dayjs(this.args.endDate).utc().format()
    const registrationEndDate = dayjs(this.args.registrationEndDate).utc().format()
    const transaction = this.context.sequelizeTransaction

    try {
      const tournament = await this.context.sequelize.models.casinoTournament.findOne({ where: { id: tournamentId }, transaction })
      if (!tournament) return this.addError('TournamentDoesNotExistErrorType')
      if (tournament.status === STATUS.SETTLED || tournament.status === STATUS.CANCELLED) return this.addError('TournamentSettledOrCancelledErrorType')
      if (!(startDate <= endDate || registrationEndDate <= endDate || registrationEndDate <= startDate)) return this.addError('InvalidDateErrorType')

      tournament.creditPoints = this.args.creditPoints || tournament.creditPoints
      tournament.name = _.merge(this.args.name, await getLanguageWiseNameJson(this.args.name))
      tournament.description = _.merge(this.args.description, await getLanguageWiseNameJson(this.args.description))
      tournament.startDate = this.args.startDate ? startDate : tournament.startDate
      tournament.endDate = this.args.endDate ? endDate : tournament.endDate
      tournament.registrationEndDate = this.args.registrationEndDate ? registrationEndDate : tournament.registrationEndDate
      tournament.changed('name', true)
      tournament.changed('description', true)
      tournament.tagIds = this.args.tagIds || tournament.tagIds

      if (this.args.casinoGameIds) {
        await this.context.sequelize.models.casinoTournamentGame.destroy({ where: { tournamentId } }, { transaction })
        let casinoGameIds = this.args.casinoGameIds
        casinoGameIds = casinoGameIds.map(casinoGameId => ({
          casinoGameId,
          tournamentId: tournament.id
        }))
        await this.context.sequelize.models.casinoTournamentGame.bulkCreate(casinoGameIds, { transaction })
      }

      if (this.args.currencyDetails) {
        const prizeData = []
        await this.context.sequelize.models.tournamentCurrency.destroy({ where: { tournamentId } }, { transaction })
        await this.context.sequelize.models.tournamentPrize.destroy({ where: { tournamentId } }, { transaction })
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
        await this.context.sequelize.models.tournamentPrize.bulkCreate(prizeData, { transaction })
      }

      if (tournamentImage) {
        await deleteFile(tournament.image, S3FolderHierarchy.tournament)
        const fileLocation = await uploadFile(tournamentImage.buffer, {
          name: tournamentImage.originalname,
          mimetype: tournamentImage.mimetype,
          filePathInS3Bucket: S3FolderHierarchy.tournament
        })
        tournament.image = fileLocation
        // await tournament.save({ transaction })
      }
      await tournament.save({ transaction })
      return { success: true }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
