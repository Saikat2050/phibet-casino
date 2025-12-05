import axios from 'axios'
import moment from 'moment'
import { THIRD_PARTY_SERVICE_PROVIDER } from '../utils/constants/constant'
import db from '../db/models'

class AxiosHelper {
  baseUrl;
  endPoint = '';
  headers;
  data = {};
  params = {};
  timeout;
  method = 'GET';
  tpServiceProvider;

  constructor ({
    baseUrl,
    headers = undefined,
    timeout = 100000,
    tpServiceProvider = THIRD_PARTY_SERVICE_PROVIDER.DEFAULT
  }) {
    this.baseUrl = baseUrl
    this.headers = headers || { 'Content-Type': 'application/json' }
    this.timeout = timeout || 100000
    this.tpServiceProvider = tpServiceProvider
  }

  async request ({
    endPoint = '',
    headers = {},
    method = 'GET',
    data,
    params,
    timeout,
    options = {}
  }) {
    this.endPoint = endPoint
    this.headers = { ...this.headers, ...headers }
    this.data = data
    this.params = params
    this.timeout = timeout || this.timeout
    this.method = method || this.method
    // this.responseType = responseType || this.responseType;

    const axiosConfig = {
      baseURL: this.baseUrl,
      url: this.endPoint,
      headers: this.headers,
      data: this.data,
      params: this.params,
      timeout: this.timeout,
      method: this.method,
      // responseType: this.responseType,
      validateStatus: (status) => {
        return status >= 200 && status < 300
      },
      ...options
    }

    const startTime = performance.now()
    try {
      const response = await axios(axiosConfig)

      const endTime = performance.now()

      // Save async TP API LOGS
      this.saveThirdPartyTimeLog({
        startTime,
        endTime,
        axiosConfig,
        responseData: response,
        tpServiceProvider: this.tpServiceProvider
      })
      return response.data || response
    } catch (error) {
      const endTime = performance.now()
      // Save async TP API LOGS
      this.saveThirdPartyTimeLog({
        startTime,
        endTime,
        axiosConfig,
        responseData: error,
        isError: true,
        tpServiceProvider: this.tpServiceProvider
      })
      console.error(`ERROR IN AXIOS HELPER - ${JSON.stringify(error)}`)

      throw error.response ? error.response?.data || error.response : error
    }
  }

  async saveThirdPartyTimeLog ({
    startTime,
    endTime,
    axiosConfig,
    responseData,
    isError = false,
    tpServiceProvider
  }) {
    let requestType = 'BODY'
    const responseTimeInMs = Number(endTime) - Number(startTime)

    // Check Request type
    if (axiosConfig.data && Object.keys(axiosConfig.data).length) {
      requestType = 'BODY'
    } else if (axiosConfig.params && Object.keys(axiosConfig.params).length) {
      requestType = 'PARAMS'
    } else {
      requestType = 'NONE'
    }

    const apiLogsData = {
      request: { ...axiosConfig.data, ...axiosConfig.params },
      instance: 'SWEEP-ADMIN-BE',
      endpoint: `${axiosConfig.method || 'GET'} ${
        (axiosConfig.url ?? '').trim() !== ''
          ? axiosConfig.baseURL
              .split('/')
              .filter((el) => (el ?? '').trim() !== '')
              .join('/') +
            '/' +
            axiosConfig.url
              .split('/')
              .filter((el) => (el ?? '').trim() !== '')
              .join('/')
          : axiosConfig.baseURL
      }`,
      timestamp: moment().format('DD-MM-YYYY HH:mm:ss'),
      responseTime: `${responseTimeInMs} ms`,
      statusCode: responseData.status
        ? responseData.status
        : isError
          ? 422
          : 200,
      requestType: requestType,
      modeDetails: axiosConfig,
      response: responseData.data || responseData,
      isThirdParty: true,
      thirdPartyServiceProvider: tpServiceProvider,
      errorResponse: isError
        ? (responseData.message || 'Something went wrong')
        : undefined
    }
    // Async API Logs entry
    if (Number(responseTimeInMs.toFixed(2)) > 950) {
      db.APILogs.create(apiLogsData)
    } else if (isError) {
      db.APILogs.create(apiLogsData)
    }
  }
}

export default AxiosHelper
