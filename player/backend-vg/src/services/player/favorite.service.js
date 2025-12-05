import ajv from '../../libs/ajv'
import { SUCCESS_MSG } from '../../utils/constants/success'
import ServiceBase from '../serviceBase'
import { getOne, createNewEntity, deleteEntity } from '../../utils/crud'
const schema = {
  type: 'object',
  properties: {
    gameId: {
      type: 'integer'
    },
    request: {
      type: 'boolean',
      enum: [true, false]
    }
  },
  required: ['gameId', 'request']
}

const constraints = ajv.compile(schema)

export class FavoriteService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const {
      req: {
        user: { detail: user }
      },
      dbModels: {
        MasterCasinoGame: MasterCasinoGameModel,
        FavoriteGame: FavoriteGameModel
      },
      sequelizeTransaction: t
    } = this.context
    try {
      const { gameId, request } = this.args
      const { userId } = user

      const isGameExist = await getOne({
        model: MasterCasinoGameModel,
        data: { masterCasinoGameId: gameId },
        attributes: ['identifier', 'masterCasinoProviderId'],
        transaction: t
      })

      if (!isGameExist) return this.addError('GameNotFoundErrorType')

      const checkAvailable = await getOne({
        model: FavoriteGameModel,
        data: { userId, masterCasinoGameId: gameId },
        attributes: ['favoriteGameId'],
        transaction: t
      })

      if (!checkAvailable === request) {
        (await request)
          ? await createNewEntity({
              model: FavoriteGameModel,
              data: {
                masterCasinoGameId: gameId,
                userId
              },
              transaction: t
            })
          : await deleteEntity({
            model: FavoriteGameModel,
            values: { favoriteGameId: checkAvailable.favoriteGameId },
            transaction: t
          })
      }

      return { success: true, data: {}, message: SUCCESS_MSG.UPDATE_SUCCESS }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
