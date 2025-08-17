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

    // Approve driver
    const { data: updatedDriver, error: updateError } = await supabase
      .from('drivers')
      .update({
        status: 'approved',
      })
      .eq('id', params.id)
      .select(`
        *,
        profile:profiles(*)
      `)
      .single();

    if (updateError) {
      console.error('Driver approval error:', updateError);
      return NextResponse.json(
        { error: 'Failed to approve driver' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedDriver,
      message: 'Driver approved successfully',
    });

  } catch (error) {
    console.error('Driver approval API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
