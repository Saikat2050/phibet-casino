import { decorateResponse } from '@src/helpers/response.helpers'
import { ChangePasswordService } from '@src/services/adminUser/changePassword.service'
import { CreateAdminUserService } from '@src/services/adminUser/createAdminUser.service'
import { ForgotPasswordService } from '@src/services/adminUser/forgotPassword.service'
import { GetAdminUserService } from '@src/services/adminUser/getAdminUser.service'
import { GetChildrenService } from '@src/services/adminUser/getChildren.service'
import { GetRolesService } from '@src/services/adminUser/getRoles.service'
import { GetStaffService } from '@src/services/adminUser/getStaff.service'
import { LoginService } from '@src/services/adminUser/login.service'
import { ToggleChildService } from '@src/services/adminUser/toggleChild.service'
import { UpdateChildService } from '@src/services/adminUser/updateChild.service'
import { UpdateProfileService } from '@src/services/adminUser/updateProfile.service'
import { UpdateSiteLayoutService } from '@src/services/adminUser/updateSiteLayout.service'
import { VerifyForgetPasswordService } from '@src/services/adminUser/verifyForgetPassword.service'
import { GetAdminActivitiesService } from '@src/services/adminUser/getAdminActivities.service'

export class AdminController {
  /**
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   * @param {import('express').NextFunction} next
   */
  static async login (req, res, next) {
    try {
      const result = await LoginService.execute(req.body, req.context)
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
  static async getAdminUser (req, res, next) {
    try {
      const result = await GetAdminUserService.execute({ adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async getRoles (req, res, next) {
    try {
      const result = await GetRolesService.execute(req.body, req.context)
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
  static async getChildren (req, res, next) {
    try {
      const result = await GetChildrenService.execute({ parentAdminId: req.authenticated.adminUserId }, req.context)
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
  static async updateChild (req, res, next) {
    try {
      const result = await UpdateChildService.execute({ ...req.body, parentAdminId: req.authenticated.adminUserId }, req.context)
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
  static async toggleChild (req, res, next) {
    try {
      const result = await ToggleChildService.execute({ ...req.body, parentAdminId: req.authenticated.adminUserId }, req.context)
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
  static async getStaff (req, res, next) {
    try {
      const result = await GetStaffService.execute({ ...req.query, parentAdminId: req.authenticated.adminUserId }, req.context)
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
  static async updateProfile (req, res, next) {
    try {
      const result = await UpdateProfileService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async forgotPassword (req, res, next) {
    try {
      const result = await ForgotPasswordService.execute(req.body, req.context)
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
  static async verifyForgotPassword (req, res, next) {
    try {
      const result = await VerifyForgetPasswordService.execute(req.body, req.context)
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
  static async changePassword (req, res, next) {
    try {
      const result = await ChangePasswordService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async createAdminUser (req, res, next) {
    try {
      const result = await CreateAdminUserService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async updateSiteLayout (req, res, next) {
    try {
      const result = await UpdateSiteLayoutService.execute({ ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
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
  static async adminActivities (req, res, next) {
    try {
      const result = await GetAdminActivitiesService.execute({ ...req.query, ...req.body, adminUserId: req.authenticated.adminUserId }, req.context)
      decorateResponse({ req, res, next }, result)
    } catch (error) {
      next(error)
    }
  }
}
