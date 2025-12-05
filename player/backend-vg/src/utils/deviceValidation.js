import { captureMessage } from '@sentry/node'
import { getUserFingerprintData } from './common'

/**
 * Validates device fingerprint data and determines if access should be allowed
 * @param {string} fingerprintVisitorId - The fingerprint visitor ID
 * @param {string} fingerprintRequestId - The fingerprint request ID
 * @param {string} context - The context where this validation is being used (e.g., 'signup', 'login')
 * @returns {Object} Validation result with success status and error details
 *
 * @example
 * // Basic usage
 * const result = await validateDeviceAccess(fingerprintVisitorId, fingerprintRequestId, 'signup')
 * if (!result.success) {
 *   console.log('Access denied:', result.error.message)
 *   return
 * }
 *
 * // Access granted, proceed with business logic
 * console.log('IP Address:', result.data.requestIpAddress)
 */
export const validateDeviceAccess = async (fingerprintVisitorId, fingerprintRequestId, context = 'general') => {
  try {
    // Check if required fingerprint data is provided
    if (!fingerprintVisitorId || !fingerprintRequestId) {
      captureMessage(`Missing device verification data during ${context}`, 'warning')
      return {
        success: false,
        error: {
          type: 'DeviceValidationErrorType',
          message: 'Device verification required'
        }
      }
    }

    const { shouldAllowAccess, requestIpAddress, subdivisionsName, isWhitelistedIp } = await getUserFingerprintData(fingerprintVisitorId, fingerprintRequestId)

    if (!shouldAllowAccess) {
      captureMessage(
        `User access denied during ${context}. IP: ${requestIpAddress}, State: ${subdivisionsName}, Whitelisted: ${isWhitelistedIp}`,
        'warning'
      )

      if (isWhitelistedIp) {
        return {
          success: false,
          error: {
            type: 'SecurityAccessDeniedErrorType',
            message: 'Security validation failed'
          }
        }
      } else {
        return {
          success: false,
          error: {
            type: 'GeolocationAccessDeniedErrorType',
            message: 'Access from current location denied'
          }
        }
      }
    }

    // Access is allowed
    return {
      success: true,
      data: {
        requestIpAddress,
        subdivisionsName,
        isWhitelistedIp
      }
    }
  } catch (deviceError) {
    captureMessage(`Device validation error during ${context}: ${deviceError.message}`, 'error')
    return {
      success: false,
      error: {
        type: 'DeviceValidationErrorType',
        message: 'Unable to verify device'
      }
    }
  }
}

/**
 * Validates device access and throws appropriate errors for use in services
 * This is a convenience function that automatically calls addError on the service instance
 *
 * @param {string} fingerprintVisitorId - The fingerprint visitor ID
 * @param {string} fingerprintRequestId - The fingerprint request ID
 * @param {string} context - The context where this validation is being used
 * @param {Object} serviceInstance - The service instance to call addError on
 * @returns {Promise<boolean>} True if validation passes, false if it fails (error already added to service)
 *
 * @example
 * // In a service class
 * export class MyService extends ServiceBase {
 *   async run() {
 *     const { fingerprintVisitorId, fingerprintRequestId } = this.args
 *
 *     // Validate device access
 *     const deviceValidationPassed = await validateDeviceAccessWithServiceError(
 *       fingerprintVisitorId,
 *       fingerprintRequestId,
 *       'login',
 *       this
 *     )
 *
 *     if (!deviceValidationPassed) {
 *       return // Error already added to service
 *     }
 *
 *     // Continue with business logic...
 *   }
 * }
 */
export const validateDeviceAccessWithServiceError = async (fingerprintVisitorId, fingerprintRequestId, context, serviceInstance) => {
  const result = await validateDeviceAccess(fingerprintVisitorId, fingerprintRequestId, context)

  if (!result.success) {
    serviceInstance.addError(result.error.type, result.error.message)
    return false
  }

  return true
}

/**
 * Middleware-style device validation function
 * Can be used in Express middleware or similar contexts
 *
 * @param {string} fingerprintVisitorId - The fingerprint visitor ID
 * @param {string} fingerprintRequestId - The fingerprint request ID
 * @param {string} context - The context where this validation is being used
 * @param {Function} onError - Callback function to handle errors
 * @param {Function} onSuccess - Callback function to handle success
 *
 * @example
 * // In middleware
 * const validateDevice = async (req, res, next) => {
 *   const { fingerprintVisitorId, fingerprintRequestId } = req.body
 *
 *   await validateDeviceAccessWithCallbacks(
 *     fingerprintVisitorId,
 *     fingerprintRequestId,
 *     'api-access',
 *     (error) => {
 *       return res.status(403).json({ error: error.message })
 *     },
 *     (data) => {
 *       req.deviceData = data
 *       next()
 *     }
 *   )
 * }
 */
export const validateDeviceAccessWithCallbacks = async (fingerprintVisitorId, fingerprintRequestId, context, onError, onSuccess) => {
  const result = await validateDeviceAccess(fingerprintVisitorId, fingerprintRequestId, context)

  if (!result.success) {
    return onError(result.error)
  }

  return onSuccess(result.data)
}
