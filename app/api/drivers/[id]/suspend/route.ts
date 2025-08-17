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
    const { reason, duration_days } = body;

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
      .select('status, user_id, is_online')
      .eq('id', params.id)
      .single();

    if (driverError) {
      console.error('Driver fetch error:', driverError);
      return NextResponse.json(
        { error: 'Driver not found' },
        { status: 404 }
      );
    }

    if (driver.status === 'suspended') {
      return NextResponse.json(
        { error: 'Driver is already suspended' },
        { status: 400 }
      );
    }

    if (driver.status === 'rejected') {
      return NextResponse.json(
        { error: 'Cannot suspend rejected driver' },
        { status: 400 }
      );
    }

    // Calculate suspension end date
    const suspensionEndDate = duration_days 
      ? new Date(Date.now() + duration_days * 24 * 60 * 60 * 1000).toISOString()
      : null;

    // Suspend driver
    const { data: updatedDriver, error: updateError } = await supabase
      .from('drivers')
      .update({
        status: 'suspended',
        is_online: false, // Force driver offline
      })
      .eq('id', params.id)
      .select(`
        *,
        profile:profiles(*)
      `)
      .single();

    if (updateError) {
      console.error('Driver suspension error:', updateError);
      return NextResponse.json(
        { error: 'Failed to suspend driver' },
        { status: 500 }
      );
    }

    // Create notification for driver
    const { error: notificationError } = await supabase
      .from('notifications')
      .insert({
        user_id: driver.user_id,
        title: 'Account Suspended',
        message: reason || 'Your driver account has been suspended. Please contact support for more information.',
        type: 'driver',
        data: {
          driver_id: params.id,
          action: 'contact_support',
          reason: reason,
          suspension_end_date: suspensionEndDate
        }
      });

    if (notificationError) {
      console.error('Notification creation error:', notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      success: true,
      data: updatedDriver,
      message: 'Driver suspended successfully',
      suspension_end_date: suspensionEndDate,
    });

  } catch (error) {
    console.error('Driver suspension API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
