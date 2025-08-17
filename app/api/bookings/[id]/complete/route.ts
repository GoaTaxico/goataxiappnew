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
    const { final_fare, rating, review } = body;

    // Check if user is admin, booking owner, or assigned driver
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
      .select('user_id, driver_id, status, final_fare')
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
    const canComplete = 
      currentProfile.role === 'admin' ||
      currentBooking.user_id === user.id ||
      (currentProfile.role === 'driver' && currentBooking.driver_id === user.id);

    if (!canComplete) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Check if booking is in valid state for completion
    if (currentBooking.status !== 'accepted') {
      return NextResponse.json(
        { error: 'Booking is not in accepted status' },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: any = {
      status: 'completed',
    };

    // Only allow final fare update if not already set
    if (final_fare && !currentBooking.final_fare) {
      updateData.final_fare = final_fare;
    }

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
      console.error('Booking completion error:', updateError);
      return NextResponse.json(
        { error: 'Failed to complete booking' },
        { status: 500 }
      );
    }

    // Update driver statistics if driver is assigned
    if (currentBooking.driver_id) {
      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .select('total_rides, rating')
        .eq('id', currentBooking.driver_id)
        .single();

      if (!driverError && driver) {
        const newTotalRides = (driver.total_rides || 0) + 1;
        
        // Calculate new rating if rating is provided
        let newRating = driver.rating || 0;
        if (rating && rating >= 1 && rating <= 5) {
          const currentTotalRating = (driver.rating || 0) * (driver.total_rides || 0);
          const newTotalRating = currentTotalRating + rating;
          newRating = newTotalRating / newTotalRides;
        }

        // Update driver statistics
        const { error: driverUpdateError } = await supabase
          .from('drivers')
          .update({
            total_rides: newTotalRides,
            rating: newRating,
          })
          .eq('id', currentBooking.driver_id);

        if (driverUpdateError) {
          console.error('Driver statistics update error:', driverUpdateError);
          // Don't fail the request if driver stats update fails
        }
      }
    }

    // Create notifications
    const notifications = [];

    // Notification for user
    if (currentBooking.user_id !== user.id) {
      notifications.push({
        user_id: currentBooking.user_id,
        title: 'Ride Completed',
        message: 'Your ride has been completed successfully!',
        type: 'booking',
        data: {
          booking_id: params.id,
          action: 'view_booking'
        }
      });
    }

    // Notification for driver
    if (currentBooking.driver_id && currentBooking.driver_id !== user.id) {
      notifications.push({
        user_id: currentBooking.driver_id,
        title: 'Ride Completed',
        message: 'You have completed the ride successfully!',
        type: 'booking',
        data: {
          booking_id: params.id,
          action: 'view_booking'
        }
      });
    }

    // Insert notifications
    if (notifications.length > 0) {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert(notifications);

      if (notificationError) {
        console.error('Notification creation error:', notificationError);
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json({
      success: true,
      data: updatedBooking,
      message: 'Booking completed successfully',
    });

  } catch (error) {
    console.error('Booking completion API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
