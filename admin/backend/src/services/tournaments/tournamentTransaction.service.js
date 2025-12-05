import { APIError } from '@src/errors/api.error'
import { alignDatabaseDateFilter } from '@src/helpers/common.helper'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { TRANSACTION_PURPOSE, TRANSACTION_TYPE } from '@src/utils/constants/casinoTournament.constants'
import { Op, Sequelize } from 'sequelize'

const schema = {
  type: 'object',
  properties: {
    tournamentId: { type: 'string' },
    currencyId: { type: 'string' },
    toDate: { type: 'string' },
    fromDate: { type: 'string' },
    userId: { type: 'string' },
    gameId: { type: 'string' },
    transactionId: { type: 'string' },
    searchString: { type: 'string' },
    gameName: { type: 'string' },
    page: { type: 'number', minimum: 1, default: 1 },
    status: { enum: Object.values(TRANSACTION_TYPE) },
    purpose: { enum: Object.values(TRANSACTION_PURPOSE) },
    perPage: { type: 'number', minimum: 10, maximum: 500, default: 10 },
    order: { enum: ['asc', 'desc'], default: 'desc' },
    orderBy: { enum: ['id', 'transactionId', 'userId', 'gameId', 'status', 'createdAt'], default: 'createdAt' }
  },
  required: ['tournamentId']
}

const constraints = ajv.compile(schema)

export class TournamentTransactionService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const toDate = this.args.toDate
    const fromDate = this.args.fromDate
    const page = this.args.page
    const status = this.args.status
    const userId = this.args.userId
    const gameId = this.args.gameId
    const perPage = this.args.perPage
    const tournamentId = this.args.tournamentId
    const transactionId = this.args.transactionId
    const purpose = this.args.purpose
    const searchString = this.args.searchString
    const gameName = this.args.gameName

    try {
      const where = {}
      const nestedWhere = {}
      where.currencyId = this.args.currencyId || 1
      if (purpose) nestedWhere.purpose = purpose
      if (status) where.status = status
      if (userId) where.userId = userId
      if (gameId) where.gameId = gameId
      if (tournamentId) where.tournamentId = tournamentId
      if (transactionId) where.transactionId = transactionId
      if (fromDate || toDate) {
        const dateFilter = alignDatabaseDateFilter(fromDate, toDate)
        where.createdAt = dateFilter
      }

      const tournamentTransactions = await this.context.sequelize.models.tournamentTransaction.findAndCountAll({
        attributes: { exclude: ['updatedAt'] },
        where,
        include: [{
          attributes: [[Sequelize.literal(`("casinoGame"."name"#>>'{${this.context.locale}}')`), 'name']],
          model: this.context.sequelize.models.casinoGame,
          where: gameName ? { 'name.EN': { [Op.like]: `%${gameName}%` } } : {}
        }, {
          attributes: ['username', 'email', 'id'],
          model: this.context.sequelize.models.user,
          where: searchString ? { [Op.or]: [{ email: { [Op.like]: `%${searchString}%` } }, { username: { [Op.like]: `%${searchString}%` } }] } : {}
        }],
        limit: perPage,
        offset: (page - 1) * perPage,
        order: [[this.args.orderBy, this.args.order]]
      })

      return { tournamentTransactions: tournamentTransactions.rows, page, totalPages: Math.ceil(tournamentTransactions.count / perPage) }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
