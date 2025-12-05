import { SUCCESS_MSG } from '../../../utils/constants/success'
import { POSTAL_CODE } from '../../../utils/constants/constant'
import ServiceBase from '../../serviceBase'
import { getOne } from '../../../utils/crud'
import { Op } from 'sequelize'

export class GetPostalCodeService extends ServiceBase {
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

      const isExist = await getOne({
        model: PostalCodeModel,
        data: {
          userId,
          isClaimed: false,
          createdAt: { [Op.between]: [new Date(new Date().setTime(new Date().getTime() - POSTAL_CODE?.POSTAL_CODE_TIME * 60000)), new Date()] }
        },
        attributes: ['postalCodeId', 'createdAt', 'postalCode'],
        raw: true,
        transaction
      })

      if (!isExist) {
        return this.addError('PostalCodeNotExistError')
      }

      isExist.remainingTime = (isExist.createdAt - new Date(new Date().setTime(new Date().getTime() - POSTAL_CODE?.POSTAL_CODE_TIME * 60000)))

      return { data: isExist || {}, success: true, message: SUCCESS_MSG.GET_SUCCESS }
    } catch (error) {
      this.addError('InternalServerErrorType', error)
    }
  }
}
