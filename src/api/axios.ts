import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://13.125.183.76:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
