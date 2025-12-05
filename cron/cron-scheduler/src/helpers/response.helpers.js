import BaseError from '@src/errors/base.error'
/**
 * @param {{
 *  req: import('express').Request,
 *  res: import('express').Response,
 *  next: import('express').NextFunction
 * }} param0
 * @param {import('@src/libs/serviceBase').default} param1
 * @returns {void}
 */
export const decorateResponse = ({ req, res, next }, { success, result, errors }) => {
  if (success) {
    res.payload = { data: result, errors: [] }
    next()
  } else {
    next(new BaseError(errors))
  }
}
