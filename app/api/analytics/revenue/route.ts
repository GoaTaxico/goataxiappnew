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

    // Get revenue from completed bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('final_fare, created_at, pickup_date')
      .eq('status', 'completed')
      .not('final_fare', 'is', null)
      .gte('pickup_date', dateFilter.gte)
      .lte('pickup_date', dateFilter.lte);

    if (bookingsError) {
      console.error('Bookings fetch error:', bookingsError);
      return NextResponse.json(
        { error: 'Failed to fetch revenue data' },
        { status: 500 }
      );
    }

    // Get subscription revenue
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('amount, created_at, status')
      .in('status', ['active', 'trial'])
      .gte('created_at', dateFilter.gte)
      .lte('created_at', dateFilter.lte);

    if (subscriptionsError) {
      console.error('Subscriptions fetch error:', subscriptionsError);
    }

    // Get payment data
    const { data: payments, error: paymentsError } = await supabase
      .from('payments')
      .select('amount, status, created_at')
      .eq('status', 'completed')
      .gte('created_at', dateFilter.gte)
      .lte('created_at', dateFilter.lte);

    if (paymentsError) {
      console.error('Payments fetch error:', paymentsError);
    }

    // Calculate revenue statistics
    const totalBookingRevenue = bookings?.reduce((sum, booking) => sum + (booking.final_fare || 0), 0) || 0;
    const totalSubscriptionRevenue = subscriptions?.reduce((sum, sub) => sum + (sub.amount || 0), 0) || 0;
    const totalPaymentRevenue = payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

    // Calculate daily revenue for charts
    const dailyRevenue: { [key: string]: number } = {};
    bookings?.forEach(booking => {
      const date = booking.pickup_date;
      if (date) {
        dailyRevenue[date] = (dailyRevenue[date] || 0) + (booking.final_fare || 0);
      }
    });

    // Calculate monthly revenue
    const monthlyRevenue: { [key: string]: number } = {};
    bookings?.forEach(booking => {
      const date = new Date(booking.pickup_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + (booking.final_fare || 0);
    });

    // Calculate average fare
    const averageFare = bookings?.length > 0 ? totalBookingRevenue / bookings.length : 0;

    // Calculate revenue growth (compare with previous period)
    const previousStart = new Date(dateFilter.gte);
    const previousEnd = new Date(dateFilter.lte);
    const daysDiff = Math.floor((previousEnd.getTime() - previousStart.getTime()) / (1000 * 60 * 60 * 24));
    
    previousStart.setDate(previousStart.getDate() - daysDiff);
    previousEnd.setDate(previousEnd.getDate() - daysDiff);

    const { data: previousBookings, error: previousBookingsError } = await supabase
      .from('bookings')
      .select('final_fare')
      .eq('status', 'completed')
      .not('final_fare', 'is', null)
      .gte('pickup_date', previousStart.toISOString().split('T')[0])
      .lte('pickup_date', previousEnd.toISOString().split('T')[0]);

    if (previousBookingsError) {
      console.error('Previous bookings fetch error:', previousBookingsError);
    }

    const previousRevenue = previousBookings?.reduce((sum, booking) => sum + (booking.final_fare || 0), 0) || 0;
    const revenueGrowth = previousRevenue > 0 ? ((totalBookingRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    return NextResponse.json({
      success: true,
      data: {
        total_revenue: totalBookingRevenue,
        subscription_revenue: totalSubscriptionRevenue,
        payment_revenue: totalPaymentRevenue,
        average_fare: averageFare,
        total_bookings: bookings?.length || 0,
        revenue_growth_percentage: revenueGrowth,
        daily_revenue: Object.entries(dailyRevenue).map(([date, revenue]) => ({
          date,
          revenue,
        })),
        monthly_revenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
          month,
          revenue,
        })),
        period: {
          start_date: dateFilter.gte,
          end_date: dateFilter.lte,
        },
      },
    });

  } catch (error) {
    console.error('Revenue analytics API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
