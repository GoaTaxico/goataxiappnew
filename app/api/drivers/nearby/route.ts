import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/types/supabase';

export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lng = parseFloat(searchParams.get('lng') || '0');
    const vehicleType = searchParams.get('vehicle_type');
    const radius = parseInt(searchParams.get('radius') || '5000');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Validate coordinates
    if (!lat || !lng || lat === 0 || lng === 0) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    // Call the nearby drivers function
    const { data: nearbyDrivers, error: nearbyError } = await supabase
      .rpc('get_nearby_drivers', {
        user_location: `POINT(${lng} ${lat})`,
        vehicle_type_filter: vehicleType || null,
        radius_meters: radius,
      });

    if (nearbyError) {
      console.error('Nearby drivers error:', nearbyError);
      return NextResponse.json(
        { error: 'Failed to fetch nearby drivers' },
        { status: 500 }
      );
    }

    // Limit results and shuffle for variety
    const limitedDrivers = nearbyDrivers
      .slice(0, limit)
      .sort(() => Math.random() - 0.5);

    return NextResponse.json({
      success: true,
      data: limitedDrivers,
      count: limitedDrivers.length,
      searchParams: {
        lat,
        lng,
        vehicleType,
        radius,
        limit,
      },
    });

  } catch (error) {
    console.error('Nearby drivers API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
