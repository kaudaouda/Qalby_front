import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import type { Country } from '../types';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const countryService = {
  async getCountries(): Promise<Country[]> {
    const response = await axiosInstance.get('/api/users/countries/');
    return response.data;
  },
};
