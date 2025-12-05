import fs from 'fs'
import axios from 'axios'
import config from '../../configs/app.config'
import { checkIfEmailExists } from '../../utils/common'
import { REGION_ALLOWED_ROUTES } from '../../utils/constants/constant'
import { AppleLoginFailedErrorType, EmailExistErrorType, EmailNotFoundErrorType, InternalServerErrorType } from '../../utils/constants/errors'

const jwt = require('jsonwebtoken')
const AppleAuth = require('apple-auth')

export async function googleLoginEmail (req, res, next) {
  try {
    const { data } = await axios.get(config.get('google.base_url'), {
      headers: { Authorization: `Bearer ${req?.body.credential}` }
    })

    const isSignup = !(await checkIfEmailExists(data.email))
    req.body = { ...req.body, firstName: data.given_name, lastName: data.family_name, profileImage: data.picture, email: data.email, isSignup }
    next()
  } catch (error) {
    next(InternalServerErrorType)
  }
}

export async function appleLoginEmail (req, res, next) {
  try {
    const auth = new AppleAuth(config.getProperties().apple, config.get('env') === 'development' ? fs.readFileSync(`AuthKey_${config.get('apple.key_id')}.p8`) : config.get('apple.secretKey'), 'text')
    console.log('authauth', auth)
    const code = req?.body?.authorization?.code
    console.log('codecode', code)
    const response = await auth.accessToken(code)
    console.log('responseresponse', response)
    const idToken = jwt.decode(response.id_token)
    console.log('idTokenidToken', idToken)
    if (!idToken?.email) next(EmailNotFoundErrorType)
    const isSignup = !(await checkIfEmailExists(idToken.email))
    console.log('isSignupisSignup', isSignup)
    req.body = { ...req.body, email: idToken.email, isSignup }
    next()
  } catch (error) {
    console.log('Getting Error in Apple Login', error)
    next(AppleLoginFailedErrorType)
  }
}

export async function emailSignupLogin (req, res, next) {
  const emailCheck = await checkIfEmailExists(req?.body?.email)
  if (req.route.path === REGION_ALLOWED_ROUTES.SIGN_UP) emailCheck ? next(EmailExistErrorType) : next()
  if (req.route.path === REGION_ALLOWED_ROUTES.LOGIN) emailCheck ? next() : next(EmailNotFoundErrorType)

  req.body.email = req.body.email.toLowerCase().replace(/\+(.*?)@/g, '@')
  next()
}
