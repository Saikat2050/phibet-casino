import ServiceBase from '../serviceBase'
import { prepareImageUrl } from '../../utils/common'
import { SUCCESS_MSG } from '../../utils/constants/success'
import { CACHE_KEYS } from '../../utils/constants/constant'
import socketServer from '../../libs/socketServer'
export class GetBannersService extends ServiceBase {
  async run () {
    const { PageBanner: BannerModel } = this.context.dbModels
    const bannersData = await socketServer.redisClient.get(CACHE_KEYS.BANNER)
    let banners = JSON.parse(bannersData || '[]')
    if (!banners.length) {
      banners = await BannerModel.findAll({
        where: { isActive: true },
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        order: ['order']
      })
    }
    if (banners.length) {
      const bannersArray = []
      for (const bannersImages of banners) {
        bannersImages.desktopImageUrl = prepareImageUrl(bannersImages.desktopImageUrl)
        bannersImages.mobileImageUrl = prepareImageUrl(bannersImages.mobileImageUrl)
        bannersArray.push(bannersImages)
      }
      banners = bannersArray
    }

    return { success: true, data: banners, message: SUCCESS_MSG.GET_SUCCESS }
  }
}
