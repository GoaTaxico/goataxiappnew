import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

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
    const { driver_id } = body;

    if (!driver_id) {
      return NextResponse.json(
        { error: 'Driver ID is required' },
        { status: 400 }
      );
    }

    // Check if user is admin or the booking owner
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

    // Get current booking
    const { data: currentBooking, error: bookingError } = await supabase
      .from('bookings')
      .select('user_id, status, driver_id')
      .eq('id', params.id)
      .single();

    if (bookingError) {
      console.error('Booking fetch error:', bookingError);
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check permissions
    const canAssign = 
      currentProfile.role === 'admin' ||
      currentBooking.user_id === user.id;

    if (!canAssign) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if booking is in valid state for assignment
    if (currentBooking.status !== 'pending') {
      return NextResponse.json(
        { error: 'Booking is not in pending status' },
        { status: 400 }
      );
    }

    // Check if driver exists and is approved
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('id, user_id, status, is_online, subscription_status')
      .eq('id', driver_id)
      .single();

    if (driverError || !driver) {
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    if (driver.status !== 'approved') {
      return NextResponse.json(
        { error: 'Driver is not approved' },
        { status: 400 }
      );
    }

    if (!driver.is_online) {
      return NextResponse.json(
        { error: 'Driver is not online' },
        { status: 400 }
      );
    }

    if (driver.subscription_status !== 'trial' && driver.subscription_status !== 'active') {
      return NextResponse.json(
        { error: 'Driver subscription is not active' },
        { status: 400 }
      );
    }

    // Get booking details for notification
    const { data: bookingDetails, error: bookingDetailsError } = await supabase
      .from('bookings')
      .select('pickup_location, drop_location')
      .eq('id', params.id)
      .single();

    if (bookingDetailsError) {
      console.error('Booking details fetch error:', bookingDetailsError);
    }

    // Update booking with driver assignment
    const { data: updatedBooking, error: updateError } = await supabase
      .from('bookings')
      .update({
        driver_id: driver_id,
        status: 'accepted',
      })
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
      console.error('Booking assignment error:', updateError);
      return NextResponse.json(
        { error: 'Failed to assign driver to booking' },
        { status: 500 }
      );
    }

    // Create notification for driver
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: driver.user_id,
        title: 'New Booking Assigned',
        message: `You have been assigned a new booking from ${bookingDetails?.pickup_location || 'pickup'} to ${bookingDetails?.drop_location || 'destination'}`,
        type: 'booking',
        data: {
          booking_id: params.id,
          action: 'view_booking'
        }
      });

    if (notificationError) {
      console.error('Notification creation error:', notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Driver assigned to booking successfully',
    });

  } catch (error) {
    console.error('Booking assignment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
