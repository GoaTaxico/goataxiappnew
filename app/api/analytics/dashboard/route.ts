import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';
import { logDatabaseError, logApiError } from '@/utils/apiLogger';

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get date range from query params
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get total users count
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    if (usersError) {
      logDatabaseError('Users count', usersError, 'dashboard');
    }

    // Get total drivers count
    const { count: totalDrivers, error: driversError } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true });

    if (driversError) {
      logDatabaseError('Drivers count', driversError, 'dashboard');
    }

    // Get active drivers count
    const { count: activeDrivers, error: activeDriversError } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })
      .eq('is_online', true)
      .eq('status', 'approved');

    if (activeDriversError) {
      logDatabaseError('Active drivers count', activeDriversError, 'dashboard');
    }

    // Get pending drivers count
    const { count: pendingDrivers, error: pendingDriversError } = await supabase
      .from('drivers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending');

    if (pendingDriversError) {
      logDatabaseError('Pending drivers count', pendingDriversError, 'dashboard');
    }

    // Get total bookings count
    const { count: totalBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true });

    if (bookingsError) {
      logDatabaseError('Bookings count', bookingsError, 'dashboard');
    }

    // Get recent bookings count (within period)
    const { count: recentBookings, error: recentBookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    if (recentBookingsError) {
      logDatabaseError('Recent bookings count', recentBookingsError, 'dashboard');
    }

    // Get completed bookings count
    const { count: completedBookings, error: completedBookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    if (completedBookingsError) {
      logDatabaseError('Completed bookings count', completedBookingsError, 'dashboard');
    }

    // Get today's bookings count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { count: todayBookings, error: todayBookingsError } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString());

    if (todayBookingsError) {
      logDatabaseError('Today bookings count', todayBookingsError, 'dashboard');
    }

    // Get subscription statistics
    const { count: activeSubscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (subscriptionsError) {
      logDatabaseError('Subscriptions count', subscriptionsError, 'dashboard');
    }

    // Get trial subscriptions count
    const { count: trialSubscriptions, error: trialSubscriptionsError } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'trial');

    if (trialSubscriptionsError) {
      logDatabaseError('Trial subscriptions count', trialSubscriptionsError, 'dashboard');
    }

    // Calculate completion rate
    const completionRate = (totalBookings ?? 0) > 0 
      ? Math.round(((completedBookings ?? 0) / (totalBookings ?? 1)) * 100) 
      : 0;

    // Get recent activity (last 10 bookings)
    const { data: recentActivity, error: activityError } = await supabase
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

    if (activityError) {
      logDatabaseError('Recent activity', activityError, 'dashboard');
    }

    const dashboardStats = {
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
      recentActivity: recentActivity || [],
      period: parseInt(period),
    };

    return NextResponse.json({
      success: true,
      data: dashboardStats,
    });

  } catch (error) {
    logApiError('Analytics dashboard API', error, 'dashboard');
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
