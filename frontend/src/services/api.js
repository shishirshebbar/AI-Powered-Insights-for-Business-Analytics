import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',  // Use your actual backend URL
});

export default api;
