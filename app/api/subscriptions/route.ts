import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Verify user authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get user's profile to check role
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // If user is admin, get all subscriptions
    if (profile.role === 'admin') {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          drivers (
            id,
            user_id,
            car_name,
            car_number,
            status,
            profiles (
              full_name,
              email,
              phone
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching subscriptions:', error);
        return NextResponse.json(
          { error: 'Failed to fetch subscriptions' },
          { status: 500 }
        );
      }

      return NextResponse.json(subscriptions);
    }

    // If user is a driver, get their subscription
    if (profile.role === 'driver') {
      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (driverError || !driver) {
        return NextResponse.json(
          { error: 'Driver profile not found' },
          { status: 404 }
        );
      }

      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('driver_id', driver.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching driver subscriptions:', error);
        return NextResponse.json(
          { error: 'Failed to fetch subscriptions' },
          { status: 500 }
        );
      }

      return NextResponse.json(subscriptions);
    }

    // Regular users don't have subscriptions
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error in subscriptions GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { driverId, planName, amount, ___currency = 'INR' } = await request.json();

    // Validate required fields
    if (!driverId || !planName || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: driverId, planName, amount' },
        { status: 400 }
      );
    }

    // Verify user authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Check if user is admin or the driver themselves
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    // Verify the driver exists and belongs to the user (if not admin)
    if (profile.role !== 'admin') {
      const { data: driver, error: driverError } = await supabase
        .from('drivers')
        .select('id')
        .eq('id', driverId)
        .eq('user_id', user.id)
        .single();

      if (driverError || !driver) {
        return NextResponse.json(
          { error: 'Driver not found or access denied' },
          { status: 404 }
        );
      }
    }

    // Create subscription
    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .insert({
        driver_id: driverId,
        plan_name: planName,
        amount,
        currency: ___currency,
        status: 'trial',
        start_date: new Date().toISOString(),
        trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days trial
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating subscription:', error);
      return NextResponse.json(
        { error: 'Failed to create subscription' },
        { status: 500 }
      );
    }

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error('Error in subscriptions POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
