import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.apiURL || 'http://localhost:3333/'
})