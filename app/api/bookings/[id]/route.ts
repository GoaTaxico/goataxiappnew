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

    // Get booking with related data
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .select(`
        *,
        user:profiles!bookings_user_id_fkey(*),
        driver:drivers!bookings_driver_id_fkey(
          *,
          profile:profiles(*)
        )
      `)
      .eq('id', params.id)
      .single();

    if (bookingError) {
      console.error('Booking fetch error:', bookingError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user can access this booking
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

    // Users can only view their own bookings, drivers can view assigned bookings, admins can view all
    const canAccess = 
      currentProfile.role === 'admin' ||
      booking.user_id === user.id ||
      (currentProfile.role === 'driver' && booking.driver_id === user.id);

    if (!canAccess) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
    });

  } catch (error) {
    console.error('Booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    const body = await request.json();
    const {
      vehicle_type,
      pickup_location,
      drop_location,
      pickup_date,
      pickup_time,
      passenger_count,
      notes,
      status,
    } = body;

    // Get current booking to check permissions
    const { data: currentBooking, error: bookingError } = await supabase
      .from('bookings')
      .select('user_id, driver_id, status')
      .eq('id', params.id)
      .single();

    if (bookingError) {
      console.error('Booking fetch error:', bookingError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user can update this booking
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

    const canUpdate = 
      currentProfile.role === 'admin' ||
      currentBooking.user_id === user.id ||
      (currentProfile.role === 'driver' && currentBooking.driver_id === user.id);

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    
    if (vehicle_type) updateData.vehicle_type = vehicle_type;
    if (pickup_location) updateData.pickup_location = pickup_location;
    if (drop_location) updateData.drop_location = drop_location;
    if (pickup_date) updateData.pickup_date = pickup_date;
    if (pickup_time) updateData.pickup_time = pickup_time;
    if (passenger_count) updateData.passenger_count = passenger_count;
    if (notes !== undefined) updateData.notes = notes;
    if (status) updateData.status = status;

    // Update booking
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', params.id)
      .select(`
        *,
        user:profiles!bookings_user_id_fkey(*),
        driver:drivers!bookings_driver_id_fkey(
          *,
          profile:profiles(*)
        )
      `)
      .single();

    if (updateError) {
      console.error('Booking update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update booking' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Booking updated successfully',
    });

  } catch (error) {
    console.error('Booking update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Get current booking to check permissions
    const { data: currentBooking, error: bookingError } = await supabase
      .from('bookings')
      .select('user_id, status')
      .eq('id', params.id)
      .single();

    if (bookingError) {
      console.error('Booking fetch error:', bookingError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user can delete this booking
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

    const canDelete = 
      currentProfile.role === 'admin' ||
      currentBooking.user_id === user.id;

    if (!canDelete) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Only allow cancellation if booking is not completed
    if (currentBooking.status === 'completed') {
      return NextResponse.json(
        { error: 'Cannot delete completed booking' },
        { status: 400 }
      );
    }

    // Delete booking
    const { error: deleteError } = await supabase
      .from('bookings')
      .delete()
      .eq('id', params.id);

    if (deleteError) {
      console.error('Booking deletion error:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete booking' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully',
    });

  } catch (error) {
    console.error('Booking deletion API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
