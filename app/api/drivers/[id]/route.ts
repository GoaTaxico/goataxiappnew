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

    // Get driver profile with user profile
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select(`
        *,
        profile:profiles(*)
      `)
      .eq('id', params.id)
      .single();

    if (driverError) {
      console.error('Driver fetch error:', driverError);
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Check if user is viewing their own driver profile or is admin
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

    // Users can only view their own driver profile, admins can view any
    if (currentProfile.role !== 'admin' && driver.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: driver,
    });

  } catch (error) {
    console.error('Driver API error:', error);
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

    // Check if user is updating their own driver profile or is admin
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
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    // Users can only update their own driver profile, admins can update any
    if (currentProfile.role !== 'admin' && driver.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      license_number,
      vehicle_type,
      car_name,
      car_number,
      car_color,
      car_model_year,
      is_online,
      current_location
    } = body;

    // Update driver profile
    const { data: updatedDriver, error: updateError } = await supabase
      .from('drivers')
      .update({
        license_number: license_number || null,
        vehicle_type: vehicle_type || null,
        car_name: car_name || null,
        car_number: car_number || null,
        car_color: car_color || null,
        car_model_year: car_model_year || null,
        is_online: is_online !== undefined ? is_online : null,
        current_location: current_location || null,
      })
      .eq('id', params.id)
      .select(`
        *,
        profile:profiles(*)
      `)
      .single();

    if (updateError) {
      console.error('Driver update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to update driver profile' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedDriver,
      message: 'Driver profile updated successfully',
    });

  } catch (error) {
    console.error('Driver API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
