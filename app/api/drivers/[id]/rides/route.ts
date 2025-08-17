import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;

    // Check if user can access this driver's rides
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Get driver to check ownership
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('user_id')
      .eq('id', params.id)
      .single();

    if (driverError) {
      console.error('Driver fetch error:', driverError);
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const canAccess = 
      currentProfile.role === 'admin' ||
      driver.user_id === user.id;

    if (!canAccess) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Build query
    let query = supabase
      .from('bookings')
      .select(`
        *,
        user:profiles!bookings_user_id_fkey(*),
        driver:drivers!bookings_driver_id_fkey(
          *,
          profile:profiles(*)
        )
      `, { count: 'exact' })
      .eq('driver_id', params.id)
      .order('created_at', { ascending: false });

    // Add status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Add date range filter if provided
    if (startDate) {
      query = query.gte('pickup_date', startDate);
    }

    if (endDate) {
      query = query.lte('pickup_date', endDate);
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    const { data: rides, error: ridesError, count } = await query;

    if (ridesError) {
      console.error('Driver rides fetch error:', ridesError);
      return NextResponse.json(
        { error: 'Failed to fetch driver rides' },
        { status: 500 }
      );
    }

    // Calculate statistics
    const totalRides = rides?.length || 0;
    const completedRides = rides?.filter(ride => ride.status === 'completed').length || 0;
    const totalEarnings = rides
      ?.filter(ride => ride.status === 'completed' && ride.final_fare)
      .reduce((sum, ride) => sum + (ride.final_fare || 0), 0) || 0;
    const averageRating = rides
      ?.filter(ride => ride.status === 'completed')
      .reduce((sum, ride) => sum + (ride.rating || 0), 0) / completedRides || 0;

    return NextResponse.json({
      success: true,
      data: rides,
      statistics: {
        total_rides: totalRides,
        completed_rides: completedRides,
        total_earnings: totalEarnings,
        average_rating: averageRating,
      },
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    console.error('Driver rides API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
