import { IDComplyAxios } from '@src/libs/axios/idComply.axios'
import { client } from '@src/libs/redis'
import { IDCOMPLY_MATCH_TYPES } from '@src/utils/constants/public.constants.utils'

export async function createIDComplyToken (userId) {
  const result = await IDComplyAxios.createToken(userId)
  const expiry = Math.ceil((new Date(result.expirationTime) - new Date()) / 1000)

  await client.set(
    `idComplyKyc:${userId}`,
    JSON.stringify({
      token: result.token,
      openKey: result.openKey,
      expirationTime: result.expirationTime
    }),
    'EX',
    expiry
  )

  return { url: result?.hostedFormLink }
}

export const idComplyProfileDataVerification = async (data) => {
  const responseObj = {
    match: false,
    errors: false,
    message: '',
    hardStop: false
  }

  const response = await IDComplyAxios.profileDataVerification(data)
  if (response.alerts?.length && response?.summary?.match === IDCOMPLY_MATCH_TYPES.FAIL) {
    const idComplyHardStopKeys = ['list.mortality', 'userId.kyc.hardstop']
    response.alerts.map((alert) => {
      if (idComplyHardStopKeys.includes(alert.key)) {
        responseObj.hardStop = true
        responseObj.errors = true
      }
      return true
    })
    return responseObj
  }
  if (response?.error) {
    responseObj.errors = true
    return responseObj
  }
  responseObj.errors = true

  if (response.details.length) {
    response.details.map(() => {
      responseObj.errors = true
      return true
    })
  }

  switch (response?.summary?.match) {
    case IDCOMPLY_MATCH_TYPES.FULL:
      responseObj.match = true
      return responseObj

    case IDCOMPLY_MATCH_TYPES.PARTIAL:
      return responseObj

    case IDCOMPLY_MATCH_TYPES.FAIL:
      responseObj.errors = true
      return responseObj

    default:
      return responseObj
  }
}
