import client from './interceptors';

export const api = {
  get: (endpoint, { params = {}, headers = {} } = {}) =>
    client.get(endpoint, { params, headers }),
  post: (endpoint, { data = {}, headers = {}, params = {} } = {}) =>
    client.post(endpoint, data, { headers, params }),
  put: (endpoint, { data = {}, headers = {}, params = {} } = {}) =>
    client.put(endpoint, data, { headers, params }),
  delete: (endpoint, { data = {}, headers = {}, params = {} } = {}) =>
    client.delete(endpoint, { data, headers, params }),
};

export default api; 