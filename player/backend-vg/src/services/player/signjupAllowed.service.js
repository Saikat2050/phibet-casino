import ServiceBase from '../serviceBase'
import { SUCCESS_MSG } from '../../utils/constants/success'

export default class SignupAllowedService extends ServiceBase {
  async run () {
    const {
      dbModels: {
        GlobalSetting: GlobalSettingModel
      }
    } = this.context
    try {
      const globalSetting = await GlobalSettingModel.findOne({
        where: {
          key: 'BLOCK_PLAYER_REGISTRATION'
        }
      })

      return {
        success: true,
        registrationBlocked: globalSetting?.dataValues?.value === 'true',
        message: SUCCESS_MSG.SIGNUP_ALLOWED
      }
    } catch (error) {
      return this.addError('InternalServerErrorType', error)
    }
  }
}
