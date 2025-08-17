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
    const { reason } = body;

    // Check if user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get driver to check current status
    const { data: driver, error: driverError } = await supabase
      .from('drivers')
      .select('status, user_id')
      .eq('id', params.id)
      .single();

    if (driverError) {
      console.error('Driver fetch error:', driverError);
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    if (driver.status !== 'pending') {
      return NextResponse.json(
        { error: 'Driver is not in pending status' },
        { status: 400 }
      );
    }

    // Reject driver
    const { data: updatedDriver, error: updateError } = await supabase
      .from('drivers')
      .update({
        status: 'rejected',
      })
      .eq('id', params.id)
      .select(`
        *,
        profile:profiles(*)
      `)
      .single();

    if (updateError) {
      console.error('Driver rejection error:', updateError);
      return NextResponse.json(
        { error: 'Failed to reject driver' },
        { status: 500 }
      );
    }

    // Create notification for driver
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: driver.user_id,
        title: 'Driver Registration Rejected',
        message: reason || 'Your driver registration has been rejected. Please contact support for more information.',
        type: 'driver',
        data: {
          driver_id: params.id,
          action: 'contact_support',
          reason: reason
        }
      });

    if (notificationError) {
      console.error('Notification creation error:', notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      data: updatedDriver,
      message: 'Driver rejected successfully',
    });

  } catch (error) {
    console.error('Driver rejection API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
