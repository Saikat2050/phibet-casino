import client from './client';
import { getCookie, deleteCookie } from '../cookiesHelper';
import { deleteBrowserCookie } from "@/utils/clientCookieUtils";
import useUserStore from "@/store/useUserStore";

// Request Interceptor
client.interceptors.request.use(
  (config) => {
    const accessToken = getCookie('accessToken');

    if (accessToken && accessToken.value) {
      config.headers['accesstoken'] = accessToken.value;
    }

    // Build the full URL
    const fullUrl = `${config.baseURL || ''}${config.url}`;

    // Log full URL, method, params, body, and headers
    console.log('➡️ API REQUEST:');
    console.log('URL:', fullUrl);
    console.log('Method:', config.method?.toUpperCase());
    if (config.params) console.log('Query Params:', config.params);
    if (config.data) console.log('Request Body:', config.data);
    console.log('Headers:', config.headers);

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
client.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response) {
      if ([401, 403, 422].includes(response.status)) {
        // Clear client-side cookie and Zustand store
        deleteBrowserCookie('accessToken');
        if (typeof window !== 'undefined') {
          try {
            useUserStore.getState().logout();
          } catch (e) {
            // fallback: just reload
          }
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default client; 