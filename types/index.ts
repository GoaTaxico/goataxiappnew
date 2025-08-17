export type UserRole = 'user' | 'driver' | 'admin';
export type VehicleType = 'hatchback' | 'sedan' | 'suv';
export type DriverStatus = 'pending' | 'approved' | 'rejected' | 'suspended';
export type SubscriptionStatus = 'trial' | 'active' | 'expired' | 'cancelled';
export type BookingStatus = 'pending' | 'accepted' | 'completed' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface Driver {
  id: string;
  user_id: string;
  license_number: string | null;
  vehicle_type: VehicleType;
  car_name: string;
  car_number: string;
  car_color: string | null;
  car_model_year: number | null;
  status: DriverStatus;
  is_online: boolean;
  current_location: any; // PostGIS geography point
  rating: number;
  total_rides: number;
  total_earnings: number;
  subscription_status: SubscriptionStatus;
  trial_start_date: string;
  trial_end_date: string;
  subscription_end_date: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export interface Vehicle {
  id: string;
  driver_id: string;
  type: VehicleType;
  name: string;
  number: string;
  color: string | null;
  model_year: number | null;
  capacity: number;
  ac_available: boolean;
  images: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  driver_id: string | null;
  vehicle_type: VehicleType;
  pickup_location: string;
  pickup_coordinates: any; // PostGIS geography point
  drop_location: string;
  drop_coordinates: any; // PostGIS geography point
  pickup_date: string;
  pickup_time: string;
  passenger_count: number;
  estimated_fare: number | null;
  final_fare: number | null;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
  user?: Profile;
  driver?: Driver;
}

export interface Subscription {
  id: string;
  driver_id: string;
  razorpay_subscription_id: string | null;
  razorpay_customer_id: string | null;
  plan_name: string;
  amount: number;
  currency: string;
  status: SubscriptionStatus;
  start_date: string;
  end_date: string | null;
  trial_end_date: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  subscription_id: string;
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  payment_method: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface DriverLocation {
  id: string;
  driver_id: string;
  location: any; // PostGIS geography point
  heading: number | null;
  speed: number | null;
  timestamp: string;
}

export interface NearbyDriver {
  driver_id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  whatsapp: string | null;
  avatar_url: string | null;
  vehicle_type: VehicleType;
  car_name: string;
  car_number: string;
  rating: number;
  total_rides: number;
  distance_meters: number;
}

export interface BookingFormData {
  vehicle_type: VehicleType;
  pickup_location: string;
  drop_location: string;
  pickup_date: string;
  pickup_time: string;
  passenger_count: number;
  notes?: string;
}

export interface DriverRegistrationData {
  license_number: string;
  vehicle_type: VehicleType;
  car_name: string;
  car_number: string;
  car_color: string;
  car_model_year: number;
  phone: string;
  whatsapp: string;
}

export interface RazorpayOrder {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface RazorpayPayment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string;
  description: string;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface DashboardStats {
  totalDrivers: number;
  activeDrivers: number;
  pendingDrivers: number;
  totalBookings: number;
  completedBookings: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface UserSession {
  user: Profile;
  driver: Driver | undefined;
  isAdmin: boolean;
  isDriver: boolean;
}
