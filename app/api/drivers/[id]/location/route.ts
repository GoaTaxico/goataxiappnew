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
    const { latitude, longitude, heading, speed } = body;

    // Validate required fields
    if (!latitude || !longitude) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Validate coordinate ranges
    if (latitude < -90 || latitude > 90) {
      return NextResponse.json(
        { error: 'Invalid latitude value' },
        { status: 400 }
      );
    }

    if (longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Invalid longitude value' },
        { status: 400 }
      );
    }

    // Check if user is the driver or admin
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
      .select('user_id, status, is_online')
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
    const canUpdate = 
      currentProfile.role === 'admin' ||
      driver.user_id === user.id;

    if (!canUpdate) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Only allow location updates if driver is online and approved
    if (!driver.is_online) {
      return NextResponse.json(
        { error: 'Driver must be online to update location' },
        { status: 400 }
      );
    }

    if (driver.status !== 'approved') {
      return NextResponse.json(
        { error: 'Driver must be approved to update location' },
        { status: 400 }
      );
    }

    // Update driver's current location
    const { data: updatedDriver, error: updateError } = await supabase
      .from('drivers')
      .update({
        current_location: `POINT(${longitude} ${latitude})`,
      })
      .eq('id', params.id)
      .select(`
        *,
        profile:profiles(*)
      `)
      .single();

    if (updateError) {
      console.error('Driver location update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update driver location' },
        { status: 500 }
      );
    }

    // Insert location record for tracking history
    const { error: locationHistoryError } = await supabase
      .from('driver_locations')
      .insert({
        driver_id: params.id,
        location: `POINT(${longitude} ${latitude})`,
        heading: heading || null,
        speed: speed || null,
      });

    if (locationHistoryError) {
      console.error('Location history insert error:', locationHistoryError);
      // Don't fail the request if location history fails
    }

    return NextResponse.json({
      success: true,
      data: {
        driver_id: params.id,
        location: {
          latitude,
          longitude,
          heading,
          speed,
        },
        timestamp: new Date().toISOString(),
      },
      message: 'Driver location updated successfully',
    });

  } catch (error) {
    console.error('Driver location update API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
