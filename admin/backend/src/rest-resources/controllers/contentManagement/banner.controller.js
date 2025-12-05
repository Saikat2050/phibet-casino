import { decorateResponse } from '@src/helpers/response.helpers'
import { DeleteBannerItemsService } from '@src/services/banner/deletebannerItems.service'
import { GetAllBannersService } from '@src/services/banner/getBanner.service'
import { UploadMultipleBannersService } from '@src/services/banner/uploadMultipleBanner.service'


export class BannerController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getBanners (req, res, next) {
    try {
      const result = await GetAllBannersService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async deleteBanner (req, res, next) {
    try {
      const result = await DeleteBannerItemsService.execute(req.query, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }

  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async uploadBanner (req, res, next) {
    try {
      let items = req.body.items
      if (!Array.isArray(items)) {
        items = items ? [items] : []
      }
      items = items.map(item => {
        if (typeof item === 'string') {
          try {
            return JSON.parse(item)
          } catch {
            return item
          }
        }
        return item
      })
      const files = req.files || []
      // Map field names to file for easier access
      const fileMap = {}
      for (const file of files) {
        fileMap[file.fieldname] = file
      }
      // Map files to the corresponding item
      items = items.map((item, idx) => {
        const imageUrlKey = `items[${idx}][imageUrl]`
        const mobileImageUrlKey = `items[${idx}][mobileImageUrl]`
        return {
          ...item,
          imageUrl: fileMap[imageUrlKey] || null,
          mobileImageUrl: fileMap[mobileImageUrlKey] || null
        }
      })
      const result = await UploadMultipleBannersService.execute(
        { ...req.body, items },
        req.context
      )
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
