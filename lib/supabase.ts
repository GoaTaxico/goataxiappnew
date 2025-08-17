import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Helper function to get user session
export const _getUserSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return session;
};

// Helper function to get current user
export const _getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  return user;
};

// Helper function to get user profile
export const _getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error getting profile:', error);
    return null;
  }
  return data;
};

// Helper function to get driver profile
export const _getDriverProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('drivers')
    .select(`
      *,
      profile:profiles(*)
    `)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error getting driver profile:', error);
    return null;
  }
  return data;
};

// Helper function to get nearby drivers
export const _getNearbyDrivers = async (
  latitude: number,
  longitude: number,
  vehicleType?: string,
  radiusMeters: number = 5000
) => {
  const { data, error } = await supabase
    .rpc('get_nearby_drivers', {
      user_location: `POINT(${longitude} ${latitude})`,
      vehicle_type_filter: vehicleType || null,
      radius_meters: radiusMeters
    });

  if (error) {
    console.error('Error getting nearby drivers:', error);
    return [];
  }
  return data;
};

// Helper function to update driver location
export const _updateDriverLocation = async (
  driverId: string,
  latitude: number,
  longitude: number,
  heading?: number,
  speed?: number
) => {
  const { error } = await supabase
    .from('driver_locations')
    .insert({
      driver_id: driverId,
      location: `POINT(${longitude} ${latitude})`,
      heading: heading || null,
      speed: speed || null
    });

  if (error) {
    console.error('Error updating driver location:', error);
    return false;
  }

  // Also update the current_location in drivers table
  const { error: updateError } = await supabase
    .from('drivers')
    .update({
      current_location: `POINT(${longitude} ${latitude})`
    })
    .eq('id', driverId);

  if (updateError) {
    console.error('Error updating driver current location:', updateError);
  }

  return true;
};

// Helper function to upload file to Supabase Storage
export const _uploadFile = async (
  bucket: string,
  path: string,
  file: File
) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  return data;
};

// Helper function to get public URL for file
export const _getPublicUrl = (bucket: string, path: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);

  return data.publicUrl;
};

// Helper function to delete file from Supabase Storage
export const _deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) {
    console.error('Error deleting file:', error);
    return false;
  }

  return true;
};

// Real-time subscription helper
export const _subscribeToRealtime = (
  table: string,
  event: 'INSERT' | 'UPDATE' | 'DELETE',
  callback: (_payload: any) => void
) => {
  return supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes' as any,
      {
        event,
        schema: 'public',
        table
      },
      callback
    )
    .subscribe();
};

// Helper function to sign out
export const _signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    return false;
  }
  return true;
};
