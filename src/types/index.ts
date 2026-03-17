export interface User {
  id: number;
  email: string;
  name: string;
  phone: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar_url?: string;
}

export interface Destination {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  created_at: string;
}

export interface TourPackage {
  id: number;
  destination_id: number;
  destination?: Destination;
  title: string;
  slug: string;
  description: string;
  category: string;
  price: number;
  discount_price?: number;
  duration_days: number;
  max_participants: number;
  min_participants: number;
  image_url: string;
  gallery: string[];
  itineraries: Itinerary[];
  facilities: Facility[];
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface Itinerary {
  day: number;
  title: string;
  description: string;
}

export interface Facility {
  name: string;
  icon: string;
  description: string;
}

export interface TourSchedule {
  id: number;
  tour_package_id: number;
  start_date: string;
  end_date: string;
  available_slots: number;
  price_override?: number;
  status: string;
}

export interface Review {
  id: number;
  user_id: number;
  user?: User;
  tour_package_id: number;
  booking_id: number;
  rating: number;
  comment: string;
  created_at: string;
}

export interface BookingParticipant {
  name: string;
  id_card_number: string;
}

export interface Booking {
  id: number;
  user_id: number;
  tour_package_id: number;
  tour_package?: TourPackage;
  tour_schedule_id: number;
  tour_schedule?: TourSchedule;
  travel_date: string;
  num_participants: number;
  total_price: number;
  status: string;
  notes: string;
  participants: BookingParticipant[];
  payment?: Payment;
  created_at: string;
  updated_at: string;
}

export interface CreateBookingRequest {
  tour_package_id: number;
  tour_schedule_id: number;
  travel_date: string;
  num_participants: number;
  notes: string;
  participants: BookingParticipant[];
}

export interface Payment {
  id: number;
  booking_id: number;
  amount: number;
  payment_method: string;
  payment_url: string;
  status: string;
  paid_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePaymentRequest {
  booking_id: number;
  payment_method: string;
}

export interface CreateReviewRequest {
  tour_package_id: number;
  booking_id: number;
  rating: number;
  comment: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ListResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface ToursQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  destination_id?: number;
}
