import axios from 'axios';

const BASE_URL = "http://user-backend:7077/api/v1";
// process.env.NEXT_PUBLIC_API_URL

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'cache': 'no-store',
  },
  withCredentials: true,
});

export default client; 