import { SUCCESS_MSG } from '../../../utils/constants/success'
import { POSTAL_CODE, POSTAL_CODE_STATUS } from '../../../utils/constants/constant'
import ServiceBase from '../../serviceBase'
import { createNewEntity, getOne } from '../../../utils/crud'
import { Op } from 'sequelize'

export class CreatePostalCodeService extends ServiceBase {
  async run () {
    try {
      const {
        req: {
          user: {
            detail: user
          }
        },
        dbModels: {
          PostalCode: PostalCodeModel
        },
        sequelizeTransaction: transaction
      } = this.context

      const { userId } = user

      const currentTimestamp = Date.now()
      const postalCode = String(currentTimestamp).slice(0, 12)

      const isExist = await getOne({
        model: PostalCodeModel,
        data: {
          userId,
          createdAt: { [Op.between]: [new Date(new Date().setTime(new Date().getTime() - POSTAL_CODE?.POSTAL_CODE_TIME * 60000)), new Date()] }
        },
        attributes: ['postalCodeId', 'createdAt'],
        raw: true
      })

      if (isExist) {
        return {
          success: false,
          description: 'You already generated the code, please try after: ',
          remainingTime: (isExist.createdAt - new Date(new Date().setTime(new Date().getTime() - POSTAL_CODE?.POSTAL_CODE_TIME * 60000)))
        }
      }

      const createdPostalCode = await createNewEntity({
        model: PostalCodeModel,
        data: {
          userId,
          postalCode,
          isClaimed: false,
          validTo: new Date().setDate(new Date().getDate() + POSTAL_CODE?.POSTAL_CODE_VALID_TILL),
          status: POSTAL_CODE_STATUS.PENDING
        },
        raw: true,
        transaction
      })

      delete (createdPostalCode?.postalCode)

      return { data: createdPostalCode || {}, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
