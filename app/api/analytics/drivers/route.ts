import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

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

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '30'; // days
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    // Calculate date range
    let dateFilter: any = {};
    if (startDate && endDate) {
      dateFilter = {
        gte: startDate,
        lte: endDate,
      };
    } else {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - parseInt(period));
      dateFilter = {
        gte: start.toISOString().split('T')[0],
        lte: end.toISOString().split('T')[0],
      };
    }

    // Get all drivers
    const { data: drivers, error: driversError } = await supabase
      .from('drivers')
      .select(`
        *,
        profile:profiles(*)
      `);

    if (driversError) {
      console.error('Drivers fetch error:', driversError);
      return NextResponse.json(
        { error: 'Failed to fetch drivers data' },
        { status: 500 }
      );
    }

    // Get driver registrations in the date range
    const { data: recentDrivers, error: recentDriversError } = await supabase
      .from('drivers')
      .select('created_at, status')
      .gte('created_at', dateFilter.gte)
      .lte('created_at', dateFilter.lte);

    if (recentDriversError) {
      console.error('Recent drivers fetch error:', recentDriversError);
    }

    // Get driver bookings in the date range
    const { data: driverBookings, error: driverBookingsError } = await supabase
      .from('bookings')
      .select('driver_id, status, final_fare, created_at')
      .not('driver_id', 'is', null)
      .gte('created_at', dateFilter.gte)
      .lte('created_at', dateFilter.lte);

    if (driverBookingsError) {
      console.error('Driver bookings fetch error:', driverBookingsError);
    }

    // Calculate driver statistics
    const totalDrivers = drivers?.length || 0;
    const approvedDrivers = drivers?.filter(driver => driver.status === 'approved').length || 0;
    const pendingDrivers = drivers?.filter(driver => driver.status === 'pending').length || 0;
    const rejectedDrivers = drivers?.filter(driver => driver.status === 'rejected').length || 0;
    const suspendedDrivers = drivers?.filter(driver => driver.status === 'suspended').length || 0;
    const onlineDrivers = drivers?.filter(driver => driver.is_online).length || 0;

    // Calculate approval rate
    const approvalRate = totalDrivers > 0 ? (approvedDrivers / totalDrivers) * 100 : 0;

    // Calculate vehicle type distribution
    const vehicleTypeStats: { [key: string]: number } = {};
    drivers?.forEach(driver => {
      const vehicleType = driver.vehicle_type;
      vehicleTypeStats[vehicleType] = (vehicleTypeStats[vehicleType] || 0) + 1;
    });

    // Calculate subscription status distribution
    const subscriptionStats: { [key: string]: number } = {};
    drivers?.forEach(driver => {
      const subscriptionStatus = driver.subscription_status;
      subscriptionStats[subscriptionStatus] = (subscriptionStats[subscriptionStatus] || 0) + 1;
    });

    // Calculate average driver rating
    const driversWithRating = drivers?.filter(driver => driver.rating > 0) || [];
    const averageRating = driversWithRating.length > 0 
      ? driversWithRating.reduce((sum, driver) => sum + driver.rating, 0) / driversWithRating.length 
      : 0;

    // Calculate total rides by drivers
    const totalRidesByDrivers = drivers?.reduce((sum, driver) => sum + (driver.total_rides || 0), 0) || 0;

    // Calculate daily driver registrations
    const dailyRegistrations: { [key: string]: number } = {};
    recentDrivers?.forEach(driver => {
      const date = driver.created_at.split('T')[0];
      dailyRegistrations[date] = (dailyRegistrations[date] || 0) + 1;
    });

    // Calculate monthly driver registrations
    const monthlyRegistrations: { [key: string]: number } = {};
    recentDrivers?.forEach(driver => {
      const date = new Date(driver.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRegistrations[monthKey] = (monthlyRegistrations[monthKey] || 0) + 1;
    });

    // Calculate driver growth (compare with previous period)
    const previousStart = new Date(dateFilter.gte);
    const previousEnd = new Date(dateFilter.lte);
    const daysDiff = Math.floor((previousEnd.getTime() - previousStart.getTime()) / (1000 * 60 * 60 * 24));
    
    previousStart.setDate(previousStart.getDate() - daysDiff);
    previousEnd.setDate(previousEnd.getDate() - daysDiff);

    const { data: previousDrivers, error: previousDriversError } = await supabase
      .from('drivers')
      .select('id')
      .gte('created_at', previousStart.toISOString())
      .lte('created_at', previousEnd.toISOString());

    if (previousDriversError) {
      console.error('Previous drivers fetch error:', previousDriversError);
    }

    const previousDriversCount = previousDrivers?.length || 0;
    const recentDriversCount = recentDrivers?.length || 0;
    const driverGrowth = previousDriversCount > 0 ? ((recentDriversCount - previousDriversCount) / previousDriversCount) * 100 : 0;

    // Calculate top performing drivers
    const topDrivers = drivers
      ?.filter(driver => driver.total_rides > 0)
      .sort((a, b) => (b.total_rides || 0) - (a.total_rides || 0))
      .slice(0, 10)
      .map(driver => ({
        id: driver.id,
        name: driver.profile?.full_name || 'Unknown',
        total_rides: driver.total_rides || 0,
        rating: driver.rating || 0,
        vehicle_type: driver.vehicle_type,
        is_online: driver.is_online,
      })) || [];

    // Calculate driver earnings from bookings
    const driverEarnings: { [key: string]: number } = {};
    driverBookings
      ?.filter(booking => booking.status === 'completed' && booking.final_fare)
      .forEach(booking => {
        driverEarnings[booking.driver_id] = (driverEarnings[booking.driver_id] || 0) + (booking.final_fare || 0);
      });

    const totalDriverEarnings = Object.values(driverEarnings).reduce((sum, earnings) => sum + earnings, 0);
    const averageDriverEarnings = Object.keys(driverEarnings).length > 0 
      ? totalDriverEarnings / Object.keys(driverEarnings).length 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        total_drivers: totalDrivers,
        approved_drivers: approvedDrivers,
        pending_drivers: pendingDrivers,
        rejected_drivers: rejectedDrivers,
        suspended_drivers: suspendedDrivers,
        online_drivers: onlineDrivers,
        approval_rate: approvalRate,
        average_rating: averageRating,
        total_rides_by_drivers: totalRidesByDrivers,
        total_driver_earnings: totalDriverEarnings,
        average_driver_earnings: averageDriverEarnings,
        driver_growth_percentage: driverGrowth,
        vehicle_type_distribution: Object.entries(vehicleTypeStats).map(([type, count]) => ({
          vehicle_type: type,
          count,
          percentage: (count / totalDrivers) * 100,
        })),
        subscription_status_distribution: Object.entries(subscriptionStats).map(([status, count]) => ({
          status,
          count,
          percentage: (count / totalDrivers) * 100,
        })),
        daily_registrations: Object.entries(dailyRegistrations).map(([date, count]) => ({
          date,
          count,
        })),
        monthly_registrations: Object.entries(monthlyRegistrations).map(([month, count]) => ({
          month,
          count,
        })),
        top_performing_drivers: topDrivers,
        period: {
          start_date: dateFilter.gte,
          end_date: dateFilter.lte,
        },
      },
    });

  } catch (error) {
    console.error('Drivers analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
