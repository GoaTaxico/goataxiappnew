export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          whatsapp: string | null
          avatar_url: string | null
          role: 'user' | 'driver' | 'admin'
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          whatsapp?: string | null
          avatar_url?: string | null
          role?: 'user' | 'driver' | 'admin'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          whatsapp?: string | null
          avatar_url?: string | null
          role?: 'user' | 'driver' | 'admin'
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      drivers: {
        Row: {
          id: string
          user_id: string
          license_number: string | null
          vehicle_type: 'hatchback' | 'sedan' | 'suv'
          car_name: string
          car_number: string
          car_color: string | null
          car_model_year: number | null
          status: 'pending' | 'approved' | 'rejected' | 'suspended'
          is_online: boolean
          current_location: unknown | null
          rating: number
          total_rides: number
          total_earnings: number
          subscription_status: 'trial' | 'active' | 'expired' | 'cancelled'
          trial_start_date: string
          trial_end_date: string
          subscription_end_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          license_number?: string | null
          vehicle_type: 'hatchback' | 'sedan' | 'suv'
          car_name: string
          car_number: string
          car_color?: string | null
          car_model_year?: number | null
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          is_online?: boolean
          current_location?: unknown | null
          rating?: number
          total_rides?: number
          total_earnings?: number
          subscription_status?: 'trial' | 'active' | 'expired' | 'cancelled'
          trial_start_date?: string
          trial_end_date?: string
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          license_number?: string | null
          vehicle_type?: 'hatchback' | 'sedan' | 'suv'
          car_name?: string
          car_number?: string
          car_color?: string | null
          car_model_year?: number | null
          status?: 'pending' | 'approved' | 'rejected' | 'suspended'
          is_online?: boolean
          current_location?: unknown | null
          rating?: number
          total_rides?: number
          total_earnings?: number
          subscription_status?: 'trial' | 'active' | 'expired' | 'cancelled'
          trial_start_date?: string
          trial_end_date?: string
          subscription_end_date?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
          driver_id: string
          type: 'hatchback' | 'sedan' | 'suv'
          name: string
          number: string
          color: string | null
          model_year: number | null
          capacity: number
          ac_available: boolean
          images: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          type: 'hatchback' | 'sedan' | 'suv'
          name: string
          number: string
          color?: string | null
          model_year?: number | null
          capacity?: number
          ac_available?: boolean
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          type?: 'hatchback' | 'sedan' | 'suv'
          name?: string
          number?: string
          color?: string | null
          model_year?: number | null
          capacity?: number
          ac_available?: boolean
          images?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string
          driver_id: string | null
          vehicle_type: 'hatchback' | 'sedan' | 'suv'
          pickup_location: string
          pickup_coordinates: unknown | null
          drop_location: string
          drop_coordinates: unknown | null
          pickup_date: string
          pickup_time: string
          passenger_count: number
          estimated_fare: number | null
          final_fare: number | null
          status: 'pending' | 'accepted' | 'completed' | 'cancelled'
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          driver_id?: string | null
          vehicle_type: 'hatchback' | 'sedan' | 'suv'
          pickup_location: string
          pickup_coordinates?: unknown | null
          drop_location: string
          drop_coordinates?: unknown | null
          pickup_date: string
          pickup_time: string
          passenger_count?: number
          estimated_fare?: number | null
          final_fare?: number | null
          status?: 'pending' | 'accepted' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          driver_id?: string | null
          vehicle_type?: 'hatchback' | 'sedan' | 'suv'
          pickup_location?: string
          pickup_coordinates?: unknown | null
          drop_location?: string
          drop_coordinates?: unknown | null
          pickup_date?: string
          pickup_time?: string
          passenger_count?: number
          estimated_fare?: number | null
          final_fare?: number | null
          status?: 'pending' | 'accepted' | 'completed' | 'cancelled'
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          driver_id: string
          razorpay_subscription_id: string | null
          razorpay_customer_id: string | null
          plan_name: string
          amount: number
          currency: string
          status: 'trial' | 'active' | 'expired' | 'cancelled'
          start_date: string
          end_date: string | null
          trial_end_date: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          driver_id: string
          razorpay_subscription_id?: string | null
          razorpay_customer_id?: string | null
          plan_name?: string
          amount: number
          currency?: string
          status?: 'trial' | 'active' | 'expired' | 'cancelled'
          start_date?: string
          end_date?: string | null
          trial_end_date?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          driver_id?: string
          razorpay_subscription_id?: string | null
          razorpay_customer_id?: string | null
          plan_name?: string
          amount?: number
          currency?: string
          status?: 'trial' | 'active' | 'expired' | 'cancelled'
          start_date?: string
          end_date?: string | null
          trial_end_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          subscription_id: string
          razorpay_payment_id: string | null
          razorpay_order_id: string | null
          amount: number
          currency: string
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: string | null
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          subscription_id: string
          razorpay_payment_id?: string | null
          razorpay_order_id?: string | null
          amount: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          subscription_id?: string
          razorpay_payment_id?: string | null
          razorpay_order_id?: string | null
          amount?: number
          currency?: string
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: string | null
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      driver_locations: {
        Row: {
          id: string
          driver_id: string
          location: unknown
          heading: number | null
          speed: number | null
          timestamp: string
        }
        Insert: {
          id?: string
          driver_id: string
          location: unknown
          heading?: number | null
          speed?: number | null
          timestamp?: string
        }
        Update: {
          id?: string
          driver_id?: string
          location?: unknown
          heading?: number | null
          speed?: number | null
          timestamp?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_nearby_drivers: {
        Args: {
          user_location: unknown
          vehicle_type_filter?: 'hatchback' | 'sedan' | 'suv'
          radius_meters?: number
        }
        Returns: {
          driver_id: string
          user_id: string
          full_name: string | null
          phone: string | null
          whatsapp: string | null
          avatar_url: string | null
          vehicle_type: 'hatchback' | 'sedan' | 'suv'
          car_name: string
          car_number: string
          rating: number
          total_rides: number
          distance_meters: number
        }[]
      }
    }
    Enums: {
      user_role: 'user' | 'driver' | 'admin'
      vehicle_type: 'hatchback' | 'sedan' | 'suv'
      driver_status: 'pending' | 'approved' | 'rejected' | 'suspended'
      subscription_status: 'trial' | 'active' | 'expired' | 'cancelled'
      booking_status: 'pending' | 'accepted' | 'completed' | 'cancelled'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
    }
  }
}
