import { appConfig } from '@src/configs'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import ServiceBase from '@src/libs/serviceBase'
import { JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import Jwt from 'jsonwebtoken'
// import { Logger } from '@src/libs/logger'
// import { AvailJoiningBonusService } from '../../bonus/availJoiningBonus.service'
// import _ from 'lodash'
import { GetDailyBonusService } from '../../bonus/getDailyBonus.service'
import { GetJoiningBonusService } from '../../bonus/getJoiningBonus.service'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    token: { type: 'string' }
  },
  required: ['token']
})

export class VerifyEmailService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const transaction = this.context.sequelizeTransaction
    try {
      let emailVerified = false
      const data = Jwt.verify(this.args.token, appConfig.jwt.secret)

      if (!data) return this.addError('InvalidTokenErrorType')
      if (data.type !== JWT_TOKEN_TYPES.VERIFY_EMAIL) return this.addError('WrongTokenTypeErrorType')

      const user = await this.context.sequelize.models.user.findOne({
        where: { id: data.userId, isActive: true },
        include: {
          model: this.context.models.wallet,
          include: {
            model: this.context.models.currency,
            where: { code: 'BONUS' }
          }
        },
        attributes: ['id', 'emailVerified', 'emailToken', 'newEmailRequested'],
        transaction
      })
      if (!user) return this.addError('UserDoesNotExistsErrorType')
      if (user.emailVerified) return this.addError('EmailAlreadyVerifiedErrorType')
      if (user.emailToken && this.args.token !== user.emailToken) return this.addError('InvalidTokenErrorType')
      user.newEmailRequested = null
      user.emailToken = ''

      // give joining bonus just after joining
      // try {
      //   const { result } = await AvailJoiningBonusService.execute({
      //     userId: user.id
      //   }, this.context)
      //   if (_.size(result?.errors)) throw new APIError(result?.errors)
      // } catch (error) {
      //   Logger.error(`Error IN BONUS USER_ID ${user.id}`, error)
      // }

      user.emailVerified = true
      emailVerified = true
      await user.save({ transaction })
      const getBonus = await GetDailyBonusService.execute({ userId: user.id }, this.context)
      const getJoiningBonus = await GetJoiningBonusService.execute({ userId: user.id }, this.context)

      return { emailVerified, user, activeBonus: getBonus.result, joiningBonus: getJoiningBonus?.result || null }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
