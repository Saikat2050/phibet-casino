import RequestInputValidationError from '@src/errors/requestInputValidation.error'
import { OPERATORS, SEGMENT_CATEGORIES } from '@src/utils/constants/segmentation.constants.utils'

export const requestInputValidation = (condition) => {
  try {
    const errors = []
    if (!Array.isArray(condition)) throw new RequestInputValidationError({ condition: 'payload must be an array' })
    for (const rows of condition) {
      for (const column in rows) {
        const columnObject = rows[column]
        if (!SEGMENT_CATEGORIES[column]) errors.push({ [column]: 'is not a valid input' })
        if (!OPERATORS[columnObject?.op]) errors.push({ [column]: `'${columnObject.op}' is not a valid operator for column '${column}'` })
        if (OPERATORS[columnObject.op] === OPERATORS.between || OPERATORS[columnObject.op] === OPERATORS.notBetween) {
          if (!(columnObject?.value1 && columnObject?.value2)) errors.push({ [column]: `${columnObject.op} requires value1 and value2` })
        }
      }
    }
    if (errors.length) return errors
    return true
  } catch (error) {
    throw Error(error)
  }
}
