import { appConfig } from '@src/configs/app.config'
import { APIError } from '@src/errors/api.error'
import ajv from '@src/libs/ajv'
import { ServiceBase } from '@src/libs/serviceBase'
import { JWT_TOKEN_TYPES } from '@src/utils/constants/app.constants'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Op } from 'sequelize'
// import { Cache } from '@src/libs/cache'
// import AuthenticationError from '@src/errors/authentication.error'
// import { errorTypes } from '@src/utils/constants/error.constants'

const constraints = ajv.compile({
  type: 'object',
  properties: {
    emailOrUsername: { type: 'string' },
    password: { type: 'string', format: 'password' }
  },
  required: ['emailOrUsername', 'password']
})

export class LoginService extends ServiceBase {
  get constraints () {
    return constraints
  }

  async run () {
    const password = this.args.password
    const emailOrUsername = this.args.emailOrUsername

    try {
      const user = await this.context.sequelize.models.adminUser.findOne({
        attributes: { exclude: ['created_at', 'updated_at'] },
        where: { [Op.or]: { email: emailOrUsername.toLowerCase(), username: emailOrUsername } },
        include: { attributes: ['id', 'permission'], model: this.context.sequelize.models.permission }
      })
      if (!user) return this.addError('UserDoesNotExistsErrorType')

      const passwordMatched = await bcrypt.compare(password, user.password)
      if (!passwordMatched) return this.addError('InvalidPasswordErrorType')

      if (!user.isActive) return this.addError('AuthenticationErrorType')

      const accessToken = jwt.sign({
        adminUserId: user.id,
        adminUserName: user.username,
        adminEmail: user.email,
        type: JWT_TOKEN_TYPES.LOGIN,
        permissions: user.permission.permission
      },
      appConfig.jwt.secret, {
        expiresIn: appConfig.jwt.expiry
      })

      // set token in redis ex 2 days
      // await Cache.set(`admin:${user.id}`, { token: accessToken }, 2*60*60)

      return { accessToken, user }
    } catch (error) {
      throw new APIError(error)
    }
  }
}
