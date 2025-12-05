import axios from 'axios'
import config from '../configs/app.config'

const apiClient = axios.create({
  baseURL: `${config.get('finix.url')}` || ''
})

// apiClient.interceptors.request.use(
//   async (config) => {
//     try {
//       const logEntry = await db.ApiLog.create({
//         userId: config.headers['User-Id'] || null, // Pass user ID if available
//         apiPath: config.url,
//         header: JSON.stringify(config.headers),
//         body: config.data ? JSON.stringify(config.data) : null,
//         responseCode: null,
//         responseBody: null,
//         error: null
//       })

//       config.metadata = { logId: logEntry.apiId } // Store log ID for updating later
//     } catch (error) {
//       console.error('Failed to log API request:', error)
//     }

//     return config
//   },
//   (error) => Promise.reject(error)
// )

// apiClient.interceptors.response.use(
//   async (response) => {
//     try {
//       if (response.config.metadata?.logId) {
//         await db.ApiLog.update(
//           {
//             responseCode: response.status,
//             responseBody: JSON.stringify(response.data)
//           },
//           { where: { apiId: response.config.metadata.logId } }
//         )
//       }
//     } catch (error) {
//       console.error('Failed to log API response:', error)
//     }

//     return response
//   },
//   async (error) => {
//     try {
//       if (error.config?.metadata?.logId) {
//         await db.ApiLog.update(
//           {
//             responseCode: error.response ? error.response.status : 500,
//             error: error.message
//           },
//           { where: { apiId: error.config.metadata.logId } }
//         )
//       }
//     } catch (err) {
//       console.error('Failed to log API error:', err)
//     }

//     return Promise.reject(error)
//   }
// )

export const getFinixHeaders = (remaingHeaders = {}) => {
  const username = config.get('finix.username')
  const password = config.get('finix.password')
  return {
    'Finix-Version': '2018-01-01',
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
    ...remaingHeaders
  }
}

export const createFinixCheckoutForm = async (detail, amount, userWallet, buyerId) => {
  try {
    const requestData = {
      merchant_id: 'MU8frPRnPj9PhMVhR4mhQu7T', // config.merchant
      payment_frequency: 'ONE_TIME',
      is_multiple_use: false,
      allowed_payment_methods: ['PAYMENT_CARD'],
      nickname: detail?.username,
      buyer_details: {
        identity_id: 'ID3zCV6E8Famtx3TCiGRiRgS',
        first_name: detail.firstName,
        last_name: detail.lastName,
        email: detail.email,
        phone_number: detail.phone
      },
      amount_details: {
        amount_type: 'FIXED',
        total_amount: amount,
        currency: 'USD'
      },
      branding: {
        brand_color: '#ff06b5',
        accent_color: '#ff06b5',
        logo: 'https://www.example.com/success/123rw21w.svg',
        icon: 'https://www.example.com/success/123rw21w.svg'
      },
      additional_details: {
        terms_of_service_url: 'https://example.com/terms_of_service.html',
        expiration_in_minutes: 10080
      }
    }

    const response = await axios.post(`${config.get('finix.url')}checkout_forms`, requestData, {
      headers: {
        ...getFinixHeaders()
      }
    })
    if (response.status >= 400) return this.addError('PaymentGatewayErrorType')

    return response.data
  } catch (error) {
    console.error('Error creating Finix Checkout Form -', error)
    return false
  }
}

export const createFinixIdentity = async (identityDetails, role, extraHeaders) => {
  try {
    const requestData = {
      entity: {
        first_name: identityDetails.firstName,
        last_name: identityDetails.lastName,
        email: identityDetails.email,
        phone: identityDetails.phone,
        personal_address: identityDetails?.personal_address ?? {}
      },
      identity_roles: [role],
      type: 'PERSONAL'
    }

    const response = await apiClient.post('identities', requestData, {
      headers: {
        ...getFinixHeaders(extraHeaders)
      }
    })
    if (response.status >= 400) return false
    return response.data
  } catch (error) {
    console.error('Error creating Finix Checkout Form -', error)
    return false
  }
}

export const createPaymentInstrument = async (paymentDetails, extraHeaders) => {
  try {
    const response = await apiClient.post('payment_instruments', paymentDetails, {
      headers: {
        ...getFinixHeaders(extraHeaders)
      }
    })

    if (response.status >= 400) return false
    return response.data
  } catch (error) {
    console.error('Error creating Finix Payment instrument -', error)
    throw new Error('Issue is creating payment instrument')
  }
}

export const makePaymentFinix = async (paymentObj, extraHeaders) => {
  try {
    const response = await apiClient.post('transfers', { ...paymentObj, tags: { test: 'sale' } }, {
      headers: {
        ...getFinixHeaders(extraHeaders)
      }
    })

    if (response.status >= 400) return false
    return response.data
  } catch (error) {
    console.error('Error making finix payment -', error)
    // throw new Error('Issue is making finix payment')
    return false
  }
}

export const authorizatingPayments = async (authObj, extraHeaders) => {
  try {
    const response = await apiClient.post('authorizations', { ...authObj, tags: { test: 'sale' } }, {
      headers: {
        ...getFinixHeaders(extraHeaders)
      }
    })

    if (response.status >= 400) return false
    return !(response.data.failure_code === 'FRAUD_DETECTED')
  } catch (error) {
    console.error('Error making finix payment -', error)
    return false
  }
}

export const verifyPaymentInstrument = async (verificationObj, instrumentId) => {
  try {
    const response = await apiClient.post(`payment_instruments/${instrumentId}/verifications`, verificationObj, {
      headers: {
        ...getFinixHeaders()
      }
    })
    if (response.status >= 400) return false
    return response.data
  } catch (e) {
    console.log('issue in verifying payment instrument', e)
    return false
  }
}

export const onboardRecipient = async (obj, identityId) => {
  try {
    const response = await apiClient.post(`identities/${identityId}/merchants`, obj, {
      headers: {
        ...getFinixHeaders()
      }
    })
    if (response.status >= 400) return false
    return response.data
  } catch (e) {
    return false
  }
}

export const refund = async (obj, transactionId, extraHeaders) => {
  try {
    const response = await apiClient.post(`transfers/${transactionId}/reversal`, obj, {
      headers: { ...getFinixHeaders(extraHeaders) }
    })
    if (response.status >= 400) return false
    return response.data
  } catch (e) {
    return false
  }
}
