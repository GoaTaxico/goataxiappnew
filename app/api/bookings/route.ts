import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const {
      vehicle_type,
      pickup_location,
      drop_location,
      pickup_date,
      pickup_time,
      passenger_count,
      notes,
      pickup_coordinates,
      drop_coordinates,
    } = body;

    // Validate required fields
    if (!vehicle_type || !pickup_location || !drop_location || !pickup_date || !pickup_time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        vehicle_type,
        pickup_location,
        drop_location,
        pickup_date,
        pickup_time,
        passenger_count: passenger_count || 1,
        notes: notes || null,
        pickup_coordinates: pickup_coordinates ? `POINT(${pickup_coordinates.lng} ${pickup_coordinates.lat})` : null,
        drop_coordinates: drop_coordinates ? `POINT(${drop_coordinates.lng} ${drop_coordinates.lat})` : null,
        status: 'pending',
      })
      .select()
      .single();

    if (bookingError) {
      console.error('Booking creation error:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
      message: 'Booking created successfully',
    });

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

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
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Add status filter if provided
    if (status) {
      query = query.eq('status', status);
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1);

    const { data: bookings, error: bookingsError, count } = await query;

    if (bookingsError) {
      console.error('Bookings fetch error:', bookingsError);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: bookings,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    });

  } catch (error) {
    console.error('Bookings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
