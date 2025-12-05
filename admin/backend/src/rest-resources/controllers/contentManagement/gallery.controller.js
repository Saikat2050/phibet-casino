import { decorateResponse } from '@src/helpers/response.helpers'
import { DeleteGalleryImageService } from '@src/services/gallery/deleteGalleryImage.service'
import { GetGalleryService } from '@src/services/gallery/getGallery.service'
import { UploadGalleryImageService } from '@src/services/gallery/uploadGalleryImage.service'

export class GalleryController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async getImages (req, res, next) {
    try {
      const result = await GetGalleryService.execute(req.query, req.context)
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
  static async uploadGalleryImage (req, res, next) {
    try {
      const result = await UploadGalleryImageService.execute({ ...req.body, file: req.file }, req.context)
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
  static async deleteGalleryImage (req, res, next) {
    try {
      const result = await DeleteGalleryImageService.execute(req.body, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
