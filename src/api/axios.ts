import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://api.hancycle.site',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
