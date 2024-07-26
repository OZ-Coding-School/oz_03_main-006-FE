import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://52.79.207.68:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
