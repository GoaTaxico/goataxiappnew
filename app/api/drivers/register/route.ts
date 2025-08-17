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

    const _body = await request.json();
    const {
      license_number,
      vehicle_type,
      car_name,
      car_number,
      car_color,
      car_model_year,
      phone,
      whatsapp,
    } = _body;

    // Validate required fields
    if (!license_number || !vehicle_type || !car_name || !car_number || !phone || !whatsapp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user is already a driver
    const { data: existingDriver, error: existingError } = await supabase
      .from('drivers')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingDriver) {
      return NextResponse.json(
        { error: 'User is already registered as a driver' },
        { status: 400 }
      );
    }

    // Update user profile with phone and whatsapp
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        phone,
        whatsapp,
        role: 'driver',
      })
      .eq('id', user.id);

    if (profileError) {
      console.error('Profile update error:', profileError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Create driver record
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .insert({
        user_id: user.id,
        license_number,
        vehicle_type,
        car_name,
        car_number,
        car_color: car_color || null,
        car_model_year: car_model_year || null,
        status: 'pending',
        is_online: false,
        rating: 0.0,
        total_rides: 0,
        total_earnings: 0.0,
        subscription_status: 'trial',
        trial_start_date: new Date().toISOString(),
        trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
      })
      .select()
      .single();

    if (driverError) {
      console.error('Driver creation error:', driverError);
      return NextResponse.json(
        { error: 'Failed to create driver profile' },
        { status: 500 }
      );
    }

    // Create vehicle record
    const { error: vehicleError } = await supabase
      .from('vehicles')
      .insert({
        driver_id: driver.id,
        type: vehicle_type,
        name: car_name,
        number: car_number,
        color: car_color || null,
        model_year: car_model_year || null,
        capacity: vehicle_type === 'suv' ? 6 : 4,
        ac_available: true,
      });

    if (vehicleError) {
      console.error('Vehicle creation error:', vehicleError);
      // Don't fail the entire request if vehicle creation fails
    }

    // Create subscription record
    const { error: subscriptionError } = await supabase
      .from('subscriptions')
      .insert({
        driver_id: driver.id,
        plan_name: 'Monthly Driver Subscription',
        amount: 999.00,
        currency: 'INR',
        status: 'trial',
        start_date: new Date().toISOString(),
        trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      });

    if (subscriptionError) {
      console.error('Subscription creation error:', subscriptionError);
      // Don't fail the entire request if subscription creation fails
    }

    return NextResponse.json({
      success: true,
      data: driver,
      message: 'Driver registration submitted successfully. Pending admin approval.',
    });

  } catch (error) {
    console.error('Driver registration API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
