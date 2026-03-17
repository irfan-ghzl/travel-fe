import axios from 'axios';
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  User,
  TourPackage,
  Destination,
  TourSchedule,
  Review,
  Booking,
  CreateBookingRequest,
  Payment,
  CreatePaymentRequest,
  CreateReviewRequest,
  ApiResponse,
  ListResponse,
  ToursQueryParams,
} from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  login: (data: LoginRequest) =>
    api.post<ApiResponse<AuthResponse>>('/v1/auth/login', data).then((r) => r.data.data),

  register: (data: RegisterRequest) =>
    api.post<ApiResponse<AuthResponse>>('/v1/auth/register', data).then((r) => r.data.data),

  getProfile: () =>
    api.get<ApiResponse<User>>('/v1/auth/profile').then((r) => r.data.data),

  updateProfile: (data: UpdateProfileRequest) =>
    api.put<ApiResponse<User>>('/v1/auth/profile', data).then((r) => r.data.data),
};

// Tours
export const toursApi = {
  list: (params: ToursQueryParams = {}) =>
    api.get<ListResponse<TourPackage>>('/v1/tours', { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<ApiResponse<TourPackage>>(`/v1/tours/${id}`).then((r) => r.data.data),

  getSchedules: (tourId: number) =>
    api.get<ApiResponse<TourSchedule[]>>(`/v1/tours/${tourId}/schedules`).then((r) => r.data.data),

  getReviews: (tourId: number) =>
    api.get<ApiResponse<Review[]>>(`/v1/tours/${tourId}/reviews`).then((r) => r.data.data),
};

// Destinations
export const destinationsApi = {
  list: () =>
    api.get<ApiResponse<Destination[]>>('/v1/destinations').then((r) => r.data.data),
};

// Bookings
export const bookingsApi = {
  create: (data: CreateBookingRequest) =>
    api.post<ApiResponse<Booking>>('/v1/bookings', data).then((r) => r.data.data),

  list: () =>
    api.get<ApiResponse<Booking[]>>('/v1/bookings').then((r) => r.data.data),

  get: (id: number) =>
    api.get<ApiResponse<Booking>>(`/v1/bookings/${id}`).then((r) => r.data.data),

  cancel: (id: number) =>
    api.post<ApiResponse<Booking>>(`/v1/bookings/${id}/cancel`).then((r) => r.data.data),
};

// Payments
export const paymentsApi = {
  create: (data: CreatePaymentRequest) =>
    api.post<ApiResponse<Payment>>('/v1/payments', data).then((r) => r.data.data),

  get: (bookingId: number) =>
    api.get<ApiResponse<Payment>>(`/v1/payments/${bookingId}`).then((r) => r.data.data),
};

// Reviews
export const reviewsApi = {
  create: (data: CreateReviewRequest) =>
    api.post<ApiResponse<Review>>('/v1/reviews', data).then((r) => r.data.data),
};

export default api;
