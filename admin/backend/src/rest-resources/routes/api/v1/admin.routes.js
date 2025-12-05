import { AdminController } from '@src/rest-resources/controllers/admin.controller'
import { databaseTransactionHandlerMiddleware } from '@src/rest-resources/middlewares/databaseTransactionHandler.middleware'
import { isAuthenticated } from '@src/rest-resources/middlewares/isAuthenticated'
import { responseValidationMiddleware } from '@src/rest-resources/middlewares/responseValidation.middleware'
import { resources } from '@src/utils/constants/permission.constant'
import { successSchema } from '@src/schema/successResponse.schema'
import { getUserSchema, getRolesSchema, loginSchema, getStaffSchema, getChildrenSchema, forgotPasswordSchema, updateProfileSchema, updateChildProfileSchema, adminActivitiesSchema } from '@src/schema/adminUser'
import express from 'express'

const adminRouter = express.Router({ mergeParams: true })

// GET REQUESTS
adminRouter.get('/', isAuthenticated(), AdminController.getAdminUser, responseValidationMiddleware(getUserSchema))
adminRouter.get('/roles', isAuthenticated(), AdminController.getRoles, responseValidationMiddleware(getRolesSchema))
adminRouter.get('/staff', isAuthenticated(), AdminController.getStaff, responseValidationMiddleware(getStaffSchema))
adminRouter.get('/children', isAuthenticated(), AdminController.getChildren, responseValidationMiddleware(getChildrenSchema))
adminRouter.get('/activity-log', isAuthenticated(), AdminController.adminActivities, responseValidationMiddleware(adminActivitiesSchema))

// POST REQUESTS
adminRouter.post('/login', AdminController.login, responseValidationMiddleware(loginSchema))
adminRouter.post('/forgot-password', AdminController.forgotPassword, responseValidationMiddleware(forgotPasswordSchema)) // Not In use API
adminRouter.post('/verify-forget-password', AdminController.verifyForgotPassword, responseValidationMiddleware(successSchema)) // Not in use
adminRouter.post('/update-profile', isAuthenticated(), AdminController.updateProfile, responseValidationMiddleware(updateProfileSchema))
adminRouter.post('/change-password', isAuthenticated(), AdminController.changePassword, responseValidationMiddleware(successSchema))
adminRouter.post('/update-site-layout', isAuthenticated(), AdminController.updateSiteLayout, responseValidationMiddleware(successSchema))
adminRouter.post('/create-user', isAuthenticated(resources.admin.create), databaseTransactionHandlerMiddleware, AdminController.createAdminUser, responseValidationMiddleware(successSchema))
adminRouter.post('/update-child', isAuthenticated(resources.admin.update), databaseTransactionHandlerMiddleware, AdminController.updateChild, responseValidationMiddleware(updateChildProfileSchema))
adminRouter.post('/toggle-child', isAuthenticated(resources.admin.toggle_status), AdminController.toggleChild, responseValidationMiddleware(successSchema))

export { adminRouter }
