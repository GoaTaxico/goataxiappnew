import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '@/lib/supabase';
import { Booking } from '@/types';

export function useBookings(userId?: string) {
  const queryClient = useQueryClient();

  // Get user bookings
  const { data: bookings, isLoading, error, refetch } = useQuery(
    ['bookings', userId],
    async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:profiles!bookings_user_id_fkey(*),
          driver:drivers!bookings_driver_id_fkey(
            *,
            profile:profiles(*)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    {
      enabled: !!userId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  // Create booking mutation
  const createBookingMutation = useMutation(
    async (bookingData: Partial<Booking>) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select(`
          *,
          user:profiles!bookings_user_id_fkey(*),
          driver:drivers!bookings_driver_id_fkey(
            *,
            profile:profiles(*)
          )
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings', userId]);
      },
    }
  );

  // Update booking mutation
  const updateBookingMutation = useMutation(
    async ({ id, updates }: { id: string; updates: any }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update(updates)
        .eq('id', id)
        .select(`
          *,
          user:profiles!bookings_user_id_fkey(*),
          driver:drivers!bookings_driver_id_fkey(
            *,
            profile:profiles(*)
          )
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings', userId]);
      },
    }
  );

  // Delete booking mutation
  const deleteBookingMutation = useMutation(
    async (bookingId: string) => {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
      
      if (error) throw error;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['bookings', userId]);
      },
    }
  );

  return {
    // Data
    bookings: bookings || [],
    
    // Loading states
    isLoading,
    createLoading: createBookingMutation.isLoading,
    updateLoading: updateBookingMutation.isLoading,
    deleteLoading: deleteBookingMutation.isLoading,
    
    // Error states
    error,
    createError: createBookingMutation.error,
    updateError: updateBookingMutation.error,
    deleteError: deleteBookingMutation.error,
    
    // Mutations
    createBooking: createBookingMutation.mutate,
    updateBooking: updateBookingMutation.mutate,
    deleteBooking: deleteBookingMutation.mutate,
    
    // Utils
    refetch,
  };
}

export function useDriverBookings(driverId?: string) {
  const queryClient = useQueryClient();

  // Get driver bookings
  const { data: bookings, isLoading, error, refetch } = useQuery(
    ['driver-bookings', driverId],
    async () => {
      if (!driverId) return [];
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:profiles!bookings_user_id_fkey(*),
          driver:drivers!bookings_driver_id_fkey(
            *,
            profile:profiles(*)
          )
        `)
        .eq('driver_id', driverId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    {
      enabled: !!driverId,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  return {
    bookings: bookings || [],
    isLoading,
    error,
    refetch,
  };
}
