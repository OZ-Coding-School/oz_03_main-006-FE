import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://43.202.53.249:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
