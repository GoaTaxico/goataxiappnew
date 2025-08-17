import { useQuery } from 'react-query';
import { supabase } from '@/lib/supabase';

export function useDashboardStats(period: number = 30) {
  const { data: stats, isLoading, error, refetch } = useQuery(
    ['dashboard-stats', period],
    async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - period);

      // Get total users count
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get total drivers count
      const { count: totalDrivers } = await supabase
        .from('drivers')
        .select('*', { count: 'exact', head: true });

      // Get active drivers count
      const { count: activeDrivers } = await supabase
        .from('drivers')
        .select('*', { count: 'exact', head: true })
        .eq('is_online', true)
        .eq('status', 'approved');

      // Get pending drivers count
      const { count: pendingDrivers } = await supabase
        .from('drivers')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get total bookings count
      const { count: totalBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true });

      // Get recent bookings count (within period)
      const { count: recentBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startDate.toISOString());

      // Get completed bookings count
      const { count: completedBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      // Get today's bookings count
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { count: todayBookings } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Get subscription statistics
      const { count: activeSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Get trial subscriptions count
      const { count: trialSubscriptions } = await supabase
        .from('subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'trial');

      // Calculate completion rate
      const completionRate = (totalBookings || 0) > 0 
        ? Math.round(((completedBookings || 0) / (totalBookings || 1)) * 100) 
        : 0;

      return {
        totalUsers: totalUsers || 0,
        totalDrivers: totalDrivers || 0,
        activeDrivers: activeDrivers || 0,
        pendingDrivers: pendingDrivers || 0,
        totalBookings: totalBookings || 0,
        recentBookings: recentBookings || 0,
        completedBookings: completedBookings || 0,
        todayBookings: todayBookings || 0,
        activeSubscriptions: activeSubscriptions || 0,
        trialSubscriptions: trialSubscriptions || 0,
        completionRate,
        period,
      };
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    }
  );

  return {
    stats: stats || {
      totalUsers: 0,
      totalDrivers: 0,
      activeDrivers: 0,
      pendingDrivers: 0,
      totalBookings: 0,
      recentBookings: 0,
      completedBookings: 0,
      todayBookings: 0,
      activeSubscriptions: 0,
      trialSubscriptions: 0,
      completionRate: 0,
      period,
    },
    isLoading,
    error,
    refetch,
  };
}

export function useRecentActivity() {
  const { data: activity, isLoading, error, refetch } = useQuery(
    'recent-activity',
    async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          user:profiles!bookings_user_id_fkey(full_name, email),
          driver:drivers!bookings_driver_id_fkey(
            profile:profiles(full_name, email)
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      return data || [];
    },
    {
      staleTime: 2 * 60 * 1000, // 2 minutes
      refetchInterval: 30 * 1000, // Refetch every 30 seconds
    }
  );

  return {
    activity: activity || [],
    isLoading,
    error,
    refetch,
  };
}
