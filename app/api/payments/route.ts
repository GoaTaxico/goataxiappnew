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

    // If user is admin, get all payments
    if (profile.role === 'admin') {
      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          *,
          subscriptions (
            id,
            plan_name,
            drivers (
              id,
              car_name,
              car_number,
              profiles (
                full_name,
                email,
                phone
              )
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching payments:', error);
        return NextResponse.json(
          { error: 'Failed to fetch payments' },
          { status: 500 }
        );
      }

      return NextResponse.json(payments);
    }

    // If user is a driver, get their payments
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

      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          *,
          subscriptions (
            id,
            plan_name
          )
        `)
        .eq('subscriptions.driver_id', driver.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching driver payments:', error);
        return NextResponse.json(
          { error: 'Failed to fetch payments' },
          { status: 500 }
        );
      }

      return NextResponse.json(payments);
    }

    // Regular users don't have payments
    return NextResponse.json([]);
  } catch (error) {
    console.error('Error in payments GET:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      subscriptionId, 
      razorpayPaymentId, 
      razorpayOrderId, 
      amount, 
      currency = 'INR',
      paymentMethod,
      description 
    } = await request.json();

    // Validate required fields
    if (!subscriptionId || !razorpayPaymentId || !razorpayOrderId || !amount) {
      return NextResponse.json(
        { error: 'Missing required fields: subscriptionId, razorpayPaymentId, razorpayOrderId, amount' },
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

    // Verify the subscription exists and belongs to the user
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select(`
        *,
        drivers (
          user_id
        )
      `)
      .eq('id', subscriptionId)
      .single();

    if (subscriptionError || !subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
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

    if (profile.role !== 'admin' && subscription.drivers.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Create payment record
    const { data: payment, error } = await supabase
      .from('payments')
      .insert({
        subscription_id: subscriptionId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_order_id: razorpayOrderId,
        amount,
        currency,
        status: 'completed',
        payment_method: paymentMethod,
        description: description || `Payment for ${subscription.plan_name}`,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating payment:', error);
      return NextResponse.json(
        { error: 'Failed to create payment record' },
        { status: 500 }
      );
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error('Error in payments POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
