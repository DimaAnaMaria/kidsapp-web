import axios from 'axios';

// URL-ul backend-ului Railway — schimba cu URL-ul tau exact
export const API_BASE_URL = 'https://web-production-31150.up.railway.app/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Adauga automat token-ul JWT la fiecare cerere
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Gestioneaza token expirat
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// Tipuri de date 
export interface Activity {
  id: string;
  title: string;
  short_description?: string;
  description?: string;
  category: string;
  subcategory?: string;
  age_min: number;
  age_max: number;
  is_recurring: boolean;
  schedule_days?: string[];
  schedule_time?: string;
  event_date?: string;
  address?: string;
  zone?: string;
  location_name?: string;
  organizer_name?: string;
  phone?: string;
  website?: string;
  price: number;
  price_type: string;
  price_notes?: string;
  rating: number;
  saves_count: number;
}

export interface User {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  age?: number;
}

export interface ChildProfile {
  id: string;
  child_name: string;
  child_age: number;
  child_gender?: string;
  dominant_profile: string;
  scores: Record<string, number>;
  quiz_source: string;
}
