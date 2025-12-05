import { validateDeviceAccess } from '../../utils/deviceValidation.js'
import { SecurityAccessDeniedErrorType, GeolocationAccessDeniedErrorType } from '../../utils/constants/errors'

/**
 * Required device validation middleware - fails if no fingerprint data provided
 * @param {string} context - The context where validation is being used
 * @returns {Function} Express middleware function
 */
export const requiredDeviceValidationMiddleware = (context = 'api-access') => {
  return async (req, res, next) => {
    try {
      const { fingerprintVisitorId, fingerprintRequestId } = req.body

      if (!fingerprintVisitorId || !fingerprintRequestId) {
        return next(SecurityAccessDeniedErrorType)
      }

      const validationResult = await validateDeviceAccess(fingerprintVisitorId, fingerprintRequestId, 'api-access')

      if (!validationResult.success) {
        if (validationResult.error.type === 'GeolocationAccessDeniedErrorType') {
          return next(GeolocationAccessDeniedErrorType)
        } else {
          return next(SecurityAccessDeniedErrorType)
        }
      }

      // Add device data to request for use in controllers
      req.deviceData = validationResult.data
      next()
    } catch (error) {
      console.error('❌ [DEVICE VALIDATION MIDDLEWARE] Error during validation:', error)
      next(error)
    }
  }
}
