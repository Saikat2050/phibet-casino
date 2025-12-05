import axios from 'axios'
import db from '../../db/models'
import Logger from '../../libs/logger'
import config from '../../configs/app.config'
import { generateHashPassword, getClientIp, trackEvent, trackSokulEvent } from '../../utils/common'
import { REGION_ALLOWED_ROUTES } from '../../utils/constants/constant'
import { AccessDeniedFromPlayerRegion, InternalServerErrorType, TemporaryEmailErrorType } from '../../utils/constants/errors'
import moment from 'moment'

export async function regionAllowedMiddleware (req, res, next) {
  try {
    const ipAddress = getClientIp(req)
    const session = req?.body?.sessionKey || req?.query?.sessionKey
    // const sessionDisabler = req?.body?.rtyuioo
    const email = req?.body?.email
    const user = res?.payload?.data?.user || res?.payload?.data?.data
    const transaction = res?.payload?.data?.transaction
    // if (!session && !sessionDisabler && req.route.path !== REGION_ALLOWED_ROUTES.ACCESS_ALLOW) next(AccessDeniedFromPlayerRegion)

    let reqData = {}
    let isSocialSignUp
    switch (req.route.path) {
      case REGION_ALLOWED_ROUTES.SIGN_UP:
        reqData = {
          config: {
            ip: {
              include: 'flags,history,id',
              version: 'v1'
            },
            email: {
              include: 'flags,history,id',
              version: 'v2'
            },
            phone: {
              include: 'flags,history,id',
              version: 'v1'
            },
            ip_api: true,
            email_api: true,
            phone_api: 'false',
            device_fingerprinting: true,
            device: {
              include: 'extended_device_location'
            }
          },
          ip: ipAddress,
          email: user?.email,
          action_type: 'account_register',
          custom_fields: {
            event: 'email_signup'
          },
          password_hash: generateHashPassword(req?.body?.password),
          affiliate_id: req?.body?.affiliateId || null,
          affiliate_name: req?.body?.affiliateId + '' || null,
          session,
          user_fullname: user?.lastName ? `${user?.firstName} ${user?.lastName}` : `${user?.firstName}`,
          user_id: user?.userId
        }
        break
      case REGION_ALLOWED_ROUTES.GOOGLE_LOGIN:
        reqData = {
          config: {
            ip: {
              include: 'flags,history,id',
              version: 'v1'
            },
            email: {
              include: 'flags,history,id',
              version: 'v2'
            },
            phone: {
              include: 'flags,history,id',
              version: 'v1'
            },
            ip_api: true,
            email_api: req?.body?.isSignup,
            phone_api: 'false',
            device_fingerprinting: true,
            device: {
              include: 'extended_device_location'
            }
          },
          ip: ipAddress,
          email: email,
          user_fullname: user?.lastName ? `${user?.firstName} ${user?.lastName}` : `${user?.firstName}`,
          user_id: user?.userId,
          password_hash: null,
          action_type: req?.body?.isSignup ? 'account_register' : 'account_login',
          affiliate_id: req?.body?.affiliateId || null,
          affiliate_name: req?.body?.affiliateId + '' || null,
          custom_fields: {
            referral_id: req?.body?.referralCode || null,
            event: req?.body?.isSignup ? 'google_signup' : 'google_login'
          },
          session
        }
        isSocialSignUp = true
        break
      case REGION_ALLOWED_ROUTES.APPLE_LOGIN:
        reqData = {
          config: {
            ip: {
              include: 'flags,history,id',
              version: 'v1'
            },
            email: {
              include: 'flags,history,id',
              version: 'v2'
            },
            phone: {
              include: 'flags,history,id',
              version: 'v1'
            },
            ip_api: true,
            email_api: req?.body?.isSignup,
            phone_api: 'false',
            device_fingerprinting: true,
            device: {
              include: 'extended_device_location'
            }
          },
          ip: ipAddress,
          email: email,
          password_hash: null,
          user_fullname: user?.firstName ? (user?.lastName ? `${user?.firstName} ${user?.lastName}` : `${user?.firstName}`) : null,
          user_id: user?.userId,
          action_type: req?.body?.isSignup ? 'account_register' : 'account_login',
          affiliate_id: req?.body?.affiliateId || null,
          affiliate_name: req?.body?.affiliateId + '' || null,
          custom_fields: {
            referral_id: req?.body?.referralCode,
            event: req?.body?.isSignup ? 'apple_signup' : 'apple_login'
          },
          session
        }
        isSocialSignUp = true
        break
      case REGION_ALLOWED_ROUTES.FACEBOOK_LOGIN:
        reqData = {
          config: {
            ip: {
              include: 'flags,history,id',
              version: 'v1'
            },
            email: {
              include: 'flags,history,id',
              version: 'v2'
            },
            phone: {
              include: 'flags,history,id',
              version: 'v1'
            },
            ip_api: true,
            email_api: user?.newGtmUser,
            phone_api: 'false',
            device_fingerprinting: true,
            device: {
              include: 'extended_device_location'
            }
          },
          ip: ipAddress,
          email: email,
          password_hash: null,
          user_fullname: user?.lastName ? `${user?.firstName} ${user?.lastName}` : `${user?.firstName}`,
          user_id: user?.userId,
          action_type: user?.newGtmUser ? 'account_register' : 'account_login',
          affiliate_id: req?.body?.affiliateId || null,
          affiliate_name: req?.body?.affiliateId + '' || null,
          custom_fields: {
            referral_id: req?.body?.referralCode,
            event: user?.newGtmUser ? 'facebook_signup' : 'facebook_login'
          },
          session
        }
        isSocialSignUp = true
        break
      case REGION_ALLOWED_ROUTES.LOGIN:
        reqData = {
          config: {
            ip: {
              include: 'flags,history,id',
              version: 'v1'
            },
            email: {
              include: 'flags,history,id',
              version: 'v2'
            },
            phone: {
              include: 'flags,history,id',
              version: 'v1'
            },
            ip_api: true,
            email_api: false,
            phone_api: 'false',
            device_fingerprinting: true,
            device: {
              include: 'extended_device_location'
            }
          },
          ip: ipAddress,
          email: user?.email,
          user_fullname: user?.lastName ? `${user?.firstName} ${user?.lastName}` : `${user?.firstName}`,
          user_id: user?.userId,
          action_type: 'account_login',
          affiliate_id: user?.affiliateId + '' || null,
          affiliate_name: user?.affiliateId + '' || null,
          password_hash: generateHashPassword(req?.body?.password),
          custom_fields: {
            event: 'email_login'
          },
          session
        }
        break
      case REGION_ALLOWED_ROUTES.ACCESS_ALLOW:
        reqData = {
          config: {
            ip: {
              include: 'flags,history,id',
              version: 'v1'
            },
            ip_api: true
          },
          ip: ipAddress,
          action_type: 'ip_verification',
          custom_fields: {
            event: 'access_allow'
          }
        }
        break
      case REGION_ALLOWED_ROUTES.DAILY_BONUS || REGION_ALLOWED_ROUTES.WELCOME_BONUS || REGION_ALLOWED_ROUTES.PROMOTION_BONUS:
        reqData = {
          config: {
            ip: {
              include: 'flags,history,id',
              version: 'v1'
            },
            ip_api: true,
            device_fingerprinting: true
          },
          ip: ipAddress,
          action_type: 'money_transfer',
          session,
          custom_fields: {
            event: 'bonus'
          }
        }
        break
      case REGION_ALLOWED_ROUTES.INIT_PAY:
        reqData = {
          config: {
            ip: {
              include: 'flags,history,id',
              version: 'v1'
            },
            email: {
              include: 'flags,history,id',
              version: 'v2'
            },
            phone: {
              version: 'v1'
            },
            ip_api: true,
            email_api: false,
            phone_api: 'true',
            device_fingerprinting: true
          },
          ip: ipAddress,
          action_type: req.body.paymentType === 'deposit' ? 'deposit' : 'withdrawal',
          session,
          custom_fields: {
            event: req.body.paymentType === 'deposit' ? 'purchase' : 'redeem',
            gender: req?.user?.detail?.gender
          }
        }
        break
      case REGION_ALLOWED_ROUTES.PHONE_VERIFICATION:
        reqData = {
          config: {
            ip: {
              include: 'flags,history,id',
              version: 'v1'
            },
            ip_api: true,
            device_fingerprinting: true
          },
          ip: ipAddress,
          action_type: 'phone_verification',
          session
        }
        break
      case REGION_ALLOWED_ROUTES.UPDATE_PROFILE:
        reqData = {
          config: {
            ip: {
              include: 'flags,history,id',
              version: 'v1'
            },
            email: {
              include: 'flags,history,id',
              version: 'v2'
            },
            phone: {
              include: 'flags,history,id',
              version: 'v1'
            },
            ip_api: true,
            email_api: false,
            phone_api: 'true',
            device_fingerprinting: true,
            device: {
              include: 'extended_device_location'
            }
          },
          ip: ipAddress,
          action_type: 'pre_deposit',
          session,
          custom_fields: {
            gender: req?.user?.detail?.gender || user?.gender
          }
        }
        break
    }
    const userData = req?.user?.detail
    // if (req.route.path === REGION_ALLOWED_ROUTES.UPDATE_PROFILE && (!userData?.firstName || !userData?.lastName || !userData?.email || !userData?.phone || !userData?.dateOfBirth || !userData?.addressLine_1 || !userData?.city || !userData?.zipCode)) {
    //   return next()
    // }

    let userObj = {}
    if (req?.user?.detail || user) {
      userObj = {
        affiliate_id: userData?.affiliateId || user?.affiliateId,
        affiliate_name: userData?.affiliateId + '' || user?.affiliateId,
        email: userData?.email || user?.email,
        password_hash: userData?.password || user?.password,
        user_fullname: userData?.firstName ? `${userData?.firstName} ${userData?.lastName}` : `${user?.firstName} ${user?.lastName}`,
        user_name: userData?.username || user?.username,
        user_firstname: userData?.firstName || user?.firstName,
        user_middlename: userData?.middleName || user?.middleName,
        user_lastname: userData?.lastName || user?.lastName,
        user_id: userData?.userId || user?.userId,
        user_created: userData?.createdAt ? Math.floor(new Date(userData?.createdAt).getTime() / 1000) : Math.floor(new Date(user?.createdAt).getTime() / 1000),
        user_dob: userData?.dateOfBirth || user?.dateOfBirth,
        user_country: 'US',
        user_city: userData?.city || user?.city,
        // user_state: userData?.state,
        user_zip: userData?.zipCode || user?.zipCode,
        user_street: userData?.addressLine_1 || user?.addressLine_1,
        user_street2: userData?.addressLine_2 || user?.addressLine_2,
        phone_number: userData ? (userData?.phone ? `${userData?.phoneCode}${userData?.phone}` : null) : (user?.phone ? `${user?.phoneCode}${user?.phone}` : null)
      }
    }

    console.log('--------req-data----------', {
      ...reqData,
      ...userObj
    })

    const options = {
      url: `${config.get('seon.base_url')}/fraud-api/v2`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': config.get('seon.api_key')
      },
      data: {
        ...reqData,
        ...userObj
      }
    }

    const {
      data: { data }
    } = await axios(options)
    console.log('Seon Data and IP address', data, ipAddress)

    if (data.state === 'DECLINE') {
      await db.FraudLog.create({
        email: data.email_details?.email || null,
        ip: data.ip_details?.ip || null,
        seonId: data.seon_id,
        fraudScore: data.fraud_score || null,
        appliedRules: JSON.stringify(data.applied_rules) || null,
        moreDetails: JSON.stringify(data)
      })
      if (data.email_details?.score > 10) {
        await transaction.rollback()
        res.removeHeader('accessToken')
        return next(TemporaryEmailErrorType)
      }
      await transaction.rollback()
      res.removeHeader('accessToken')
      return next(AccessDeniedFromPlayerRegion)
    }
    if (reqData?.action_type === 'account_register') await affiliateEvents(user, req?.body?.sokulId, transaction, isSocialSignUp)
    await transaction.commit()
    next()
  } catch (error) {
    console.log(error)
    console.log(error?.response?.data?.error)
    Logger.error('Error while checking location', error)
    return next(InternalServerErrorType)
  }
} async function affiliateEvents (user, sokulId, transaction, isSocialSignUp) {
  if (user?.affiliateCode && isSocialSignUp) {
    const scalioData = {
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      type: 'reg',
      click_id: user?.affiliateCode.replaceAll('-', ''),
      adv_user_id: user?.userId,
      amount: 0,
      currency: 'USD',
      event_id: user?.userId
    }
    await trackEvent(scalioData)
  }
  let sokulData = {
    dt: new Date(user?.createdAt).toISOString().replace('T', ' ').split('.')[0],
    email: user?.email,
    first_name: user?.firstName || '',
    last_name: user?.lastName || ''
  }
  if (sokulId) {
    sokulData = { ...sokulData, cid: sokulId }
  }
  const sokulResponse = await trackSokulEvent(sokulData, 'registration', isSocialSignUp)
  if (sokulResponse?.status === 200) {
    const updatedMoreDetails = {
      ...user?.moreDetails,
      sokulId: String(sokulId || ''),
      sokulResponseId: sokulResponse.data
    }

    await db.User.update(
      { moreDetails: updatedMoreDetails },
      { where: { userId: user?.userId }, transaction }
    )
  } else {
    console.log('sokul response error while registration ', sokulResponse)
  }
}
