import axios from 'axios';
import querySerializer from '../utils/querySerializer';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  paramsSerializer: querySerializer as any,
});

export default api;
