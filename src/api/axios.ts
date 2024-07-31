import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://43.201.142.187:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
