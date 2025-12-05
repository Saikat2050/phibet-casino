import axios from 'axios'

class AxiosHelper {
  baseUrl;
  endPoint = '';
  headers;
  data = {};
  params = {};
  timeout;
  method = 'GET';

  constructor ({ baseUrl, headers = undefined, timeout = 100000 }) {
    this.baseUrl = baseUrl
    this.headers = headers || { 'Content-Type': 'application/json' }
    this.timeout = timeout || 100000
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

    try {
      console.log("AXIOS PAYLOAD ====", axiosConfig)
      const response = await axios(axiosConfig)

      return response.data || response
    } catch (error) {
      console.error(`ERROR IN AXIOS HELPER - ${JSON.stringify(error)}`)

      throw error.response ? error.response?.data || error.response : error
    }
  }
}

export default AxiosHelper
