import { useQuery, useMutation, useQueryClient } from 'react-query';
import { supabase } from '@/lib/supabase';
import { Driver } from '@/types';

export function useNearbyDrivers(latitude?: number, longitude?: number, vehicleType?: string) {
  const { data: drivers, isLoading, error, refetch } = useQuery(
    ['nearby-drivers', latitude, longitude, vehicleType],
    async () => {
      if (!latitude || !longitude) return [];
      
      const { data, error } = await supabase
        .rpc('get_nearby_drivers', {
          user_location: `POINT(${longitude} ${latitude})`,
          vehicle_type_filter: vehicleType || null,
          radius_meters: 5000,
        });
      
      if (error) throw error;
      return data || [];
    },
    {
      enabled: !!latitude && !!longitude,
      staleTime: 30 * 1000, // 30 seconds
      refetchInterval: 30 * 1000, // Refetch every 30 seconds
    }
  );

  return {
    drivers: drivers || [],
    isLoading,
    error,
    refetch,
  };
}

export function useDrivers() {
  const { data: drivers, isLoading, error, refetch } = useQuery(
    'all-drivers',
    async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select(`
          *,
          profile:profiles(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  return {
    drivers: drivers || [],
    isLoading,
    error,
    refetch,
  };
}

export function usePendingDrivers() {
  const { data: drivers, isLoading, error, refetch } = useQuery(
    'pending-drivers',
    async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select(`
          *,
          profile:profiles(*)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 30 * 1000, // Refetch every 30 seconds
    }
  );

  return {
    drivers: drivers || [],
    isLoading,
    error,
    refetch,
  };
}

export function useDriverActions() {
  const queryClient = useQueryClient();

  // Approve driver mutation
  const approveDriverMutation = useMutation(
    async (driverId: string) => {
      const { data, error } = await supabase
        .from('drivers')
        .update({ status: 'approved' })
        .eq('id', driverId)
        .select(`
          *,
          profile:profiles(*)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('all-drivers');
        queryClient.invalidateQueries('pending-drivers');
      },
    }
  );

  // Reject driver mutation
  const rejectDriverMutation = useMutation(
    async ({ driverId, reason }: { driverId: string; reason?: string }) => {
      const { data, error } = await supabase
        .from('drivers')
        .update({ status: 'rejected' })
        .eq('id', driverId)
        .select(`
          *,
          profile:profiles(*)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('all-drivers');
        queryClient.invalidateQueries('pending-drivers');
      },
    }
  );

  // Update driver online status
  const updateDriverStatusMutation = useMutation(
    async ({ driverId, isOnline }: { driverId: string; isOnline: boolean }) => {
      const { data, error } = await supabase
        .from('drivers')
        .update({ is_online: isOnline })
        .eq('id', driverId)
        .select(`
          *,
          profile:profiles(*)
        `)
        .single();
      
      if (error) throw error;
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('all-drivers');
        queryClient.invalidateQueries('nearby-drivers');
      },
    }
  );

  return {
    // Mutations
    approveDriver: approveDriverMutation.mutate,
    rejectDriver: rejectDriverMutation.mutate,
    updateDriverStatus: updateDriverStatusMutation.mutate,
    
    // Loading states
    approveLoading: approveDriverMutation.isLoading,
    rejectLoading: rejectDriverMutation.isLoading,
    updateStatusLoading: updateDriverStatusMutation.isLoading,
    
    // Error states
    approveError: approveDriverMutation.error,
    rejectError: rejectDriverMutation.error,
    updateStatusError: updateDriverStatusMutation.error,
  };
}
