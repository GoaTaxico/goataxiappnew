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

    // Get all bookings in the date range
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('status, vehicle_type, pickup_date, created_at, final_fare, passenger_count')
      .gte('pickup_date', dateFilter.gte)
      .lte('pickup_date', dateFilter.lte);

    if (bookingsError) {
      console.error('Bookings fetch error:', bookingsError);
      return NextResponse.json(
        { error: 'Failed to fetch rides data' },
        { status: 500 }
      );
    }

    // Calculate ride statistics
    const totalRides = bookings?.length || 0;
    const completedRides = bookings?.filter(booking => booking.status === 'completed').length || 0;
    const pendingRides = bookings?.filter(booking => booking.status === 'pending').length || 0;
    const cancelledRides = bookings?.filter(booking => booking.status === 'cancelled').length || 0;
    const acceptedRides = bookings?.filter(booking => booking.status === 'accepted').length || 0;

    // Calculate completion rate
    const completionRate = totalRides > 0 ? (completedRides / totalRides) * 100 : 0;

    // Calculate average passengers per ride
    const totalPassengers = bookings?.reduce((sum, booking) => sum + (booking.passenger_count || 1), 0) || 0;
    const averagePassengers = totalRides > 0 ? totalPassengers / totalRides : 0;

    // Calculate vehicle type distribution
    const vehicleTypeStats: { [key: string]: number } = {};
    bookings?.forEach(booking => {
      const vehicleType = booking.vehicle_type;
      vehicleTypeStats[vehicleType] = (vehicleTypeStats[vehicleType] || 0) + 1;
    });

    // Calculate daily rides for charts
    const dailyRides: { [key: string]: number } = {};
    bookings?.forEach(booking => {
      const date = booking.pickup_date;
      if (date) {
        dailyRides[date] = (dailyRides[date] || 0) + 1;
      }
    });

    // Calculate monthly rides
    const monthlyRides: { [key: string]: number } = {};
    bookings?.forEach(booking => {
      const date = new Date(booking.pickup_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRides[monthKey] = (monthlyRides[monthKey] || 0) + 1;
    });

    // Calculate rides growth (compare with previous period)
    const previousStart = new Date(dateFilter.gte);
    const previousEnd = new Date(dateFilter.lte);
    const daysDiff = Math.floor((previousEnd.getTime() - previousStart.getTime()) / (1000 * 60 * 60 * 24));
    
    previousStart.setDate(previousStart.getDate() - daysDiff);
    previousEnd.setDate(previousEnd.getDate() - daysDiff);

    const { data: previousBookings, error: previousBookingsError } = await supabase
      .from('bookings')
      .select('id')
      .gte('pickup_date', previousStart.toISOString().split('T')[0])
      .lte('pickup_date', previousEnd.toISOString().split('T')[0]);

    if (previousBookingsError) {
      console.error('Previous bookings fetch error:', previousBookingsError);
    }

    const previousRides = previousBookings?.length || 0;
    const ridesGrowth = previousRides > 0 ? ((totalRides - previousRides) / previousRides) * 100 : 0;

    // Calculate average fare for completed rides
    const completedBookingsWithFare = bookings?.filter(booking => 
      booking.status === 'completed' && booking.final_fare
    ) || [];
    const totalFare = completedBookingsWithFare.reduce((sum, booking) => sum + (booking.final_fare || 0), 0);
    const averageFare = completedBookingsWithFare.length > 0 ? totalFare / completedBookingsWithFare.length : 0;

    // Get peak hours analysis
    const hourlyRides: { [key: string]: number } = {};
    bookings?.forEach(booking => {
      const time = booking.pickup_date;
      if (time) {
        const hour = time.split(':')[0];
        hourlyRides[hour] = (hourlyRides[hour] || 0) + 1;
      }
    });

    // Find peak hours
    const peakHours = Object.entries(hourlyRides)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([hour, count]) => ({ hour, count }));

    return NextResponse.json({
      success: true,
      data: {
        total_rides: totalRides,
        completed_rides: completedRides,
        pending_rides: pendingRides,
        cancelled_rides: cancelledRides,
        accepted_rides: acceptedRides,
        completion_rate: completionRate,
        average_passengers: averagePassengers,
        average_fare: averageFare,
        rides_growth_percentage: ridesGrowth,
        vehicle_type_distribution: Object.entries(vehicleTypeStats).map(([type, count]) => ({
          vehicle_type: type,
          count,
          percentage: (count / totalRides) * 100,
        })),
        daily_rides: Object.entries(dailyRides).map(([date, count]) => ({
          date,
          count,
        })),
        monthly_rides: Object.entries(monthlyRides).map(([month, count]) => ({
          month,
          count,
        })),
        peak_hours: peakHours,
        period: {
          start_date: dateFilter.gte,
          end_date: dateFilter.lte,
        },
      },
    });

  } catch (error) {
    console.error('Rides analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
