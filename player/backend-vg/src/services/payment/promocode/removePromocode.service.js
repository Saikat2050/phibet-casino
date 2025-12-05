import { Op } from 'sequelize'
import ServiceBase from '../../serviceBase'
import socketServer from '../../../libs/socketServer'

export class RemovePromocodeService extends ServiceBase {
  async run () {
    const {
      dbModels: { Promocode: PromocodeModel }
    } = this.context

    const { id: userId, promocode } = this.args

    const promocodeExist = await PromocodeModel.findOne({
      attributes: ['promocodeId'],
      where: {
        promocode: promocode.trim(),
        isActive: true,
        [Op.or]: [
          { validTill: { [Op.gte]: new Date(Date.now()) } },
          { validTill: { [Op.is]: null } }
        ]
      },
      raw: true
    })

    const activeCount = await socketServer.redisClient.get(`promocodeCount:${promocodeExist.promocodeId}:${userId}`)
    if (activeCount && +activeCount > 0) await socketServer.redisClient.decr(`promocodeCount:${promocodeExist.promocodeId}:${userId}`)

    return {
      success: true,
      message: 'Promocode removed successfully'
    }
  }
}
