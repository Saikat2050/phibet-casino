import RequestInputValidationError from '@src/errors/requestInputValidation.error'
import { errorTypes } from '@src/utils/constants/error.constants'
import { extractErrorAttributes } from '@src/utils/error.utils'
import _ from 'lodash'

/**
 * @param {{
*  req: import('express').Request,
*  res: import('express').Response,
*  next: import('express').NextFunction
* }} param0
* @param {import('@src/libs/serviceBase').default} param1
* @returns {void}
*/
export const decorateScaleoResponse = ({ req, res, next }, { success, result, errors }) => {
  if (success) {
    res.send({
      status: result.status,
      code: result.code,
      data: result.data
    })
  } else {
    if (!_.isEmpty(errors)) {
      const errorValues = _.values(errors)
      if (_.has(errorValues[0], 'validationErrors')) {
        next(new RequestInputValidationError(_.get(errorValues[0], 'validationErrors')))
      } else {
        next(extractErrorAttributes(errors).map(errorAttr => errorTypes[errorAttr] || errorAttr))
      }
    }
    next(errors)
  }
}
