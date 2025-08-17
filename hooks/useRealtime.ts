import { useEffect, useRef, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import toast from 'react-hot-toast';

interface LocationUpdate {
  driver_id: string;
  location: { lat: number; lng: number };
  heading?: number;
  speed?: number;
  timestamp: string;
}

interface BookingUpdate {
  id: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  driver_id?: string;
  user_id: string;
  pickup_location: string;
  drop_location: string;
  estimated_fare: number;
  created_at: string;
}

interface DriverStatusUpdate {
  driver_id: string;
  is_online: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
}

export function useRealtime() {
  const { user, profile } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [activeChannels, setActiveChannels] = useState<RealtimeChannel[]>([]);
  const channelsRef = useRef<RealtimeChannel[]>([]);

  // Cleanup function
  const cleanup = () => {
    channelsRef.current.forEach(channel => {
      supabase.removeChannel(channel);
    });
    channelsRef.current = [];
    setActiveChannels([]);
    setIsConnected(false);
  };

  // Subscribe to driver location updates
  const _subscribeToDriverLocations = (
    driverIds: string[],
    onLocationUpdate: (update: LocationUpdate) => void
  ) => {
    if (!driverIds.length) return null;

    const channel = supabase
      .channel(`driver_locations_${driverIds.join('_')}`)
      .on(
        'postgres_changes' as any,
        {
          event: 'INSERT',
          schema: 'public',
          table: 'driver_locations',
          filter: `driver_id=in.(${driverIds.join(',')})`
        },
        (payload) => {
          const location = payload.new as any;
          if (location) {
            // Parse the geography point
            const coords = location.location.replace(/[()]/g, '').split(' ');
            const update: LocationUpdate = {
              driver_id: location.driver_id,
              location: {
                lng: parseFloat(coords[0]),
                lat: parseFloat(coords[1])
              },
              heading: location.heading,
              speed: location.speed,
              timestamp: location.timestamp
            };
            onLocationUpdate(update);
          }
        }
      )
      .subscribe();

    channelsRef.current.push(channel);
    setActiveChannels(prev => [...prev, channel]);
    return channel;
  };

  // Subscribe to booking updates
  const _subscribeToBookings = (
    onBookingUpdate: (update: BookingUpdate) => void,
    filter?: { user_id?: string; driver_id?: string }
  ) => {
    let filterString = '';
    if (filter?.user_id) {
      filterString = `user_id=eq.${filter.user_id}`;
    } else if (filter?.driver_id) {
      filterString = `driver_id=eq.${filter.driver_id}`;
    }

    const channel = supabase
      .channel(`bookings_${filter?.user_id || filter?.driver_id || 'all'}`)
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          ...(filterString && { filter: filterString })
        },
        (payload) => {
          const booking = payload.new as any;
          if (booking) {
            const update: BookingUpdate = {
              id: booking.id,
              status: booking.status,
              driver_id: booking.driver_id,
              user_id: booking.user_id,
              pickup_location: booking.pickup_location,
              drop_location: booking.drop_location,
              estimated_fare: booking.estimated_fare,
              created_at: booking.created_at
            };
            onBookingUpdate(update);
          }
        }
      )
      .subscribe();

    channelsRef.current.push(channel);
    setActiveChannels(prev => [...prev, channel]);
    return channel;
  };

  // Subscribe to driver status updates
  const _subscribeToDriverStatus = (
    onStatusUpdate: (update: DriverStatusUpdate) => void,
    driverId?: string
  ) => {
    const filterString = driverId ? `id=eq.${driverId}` : '';

    const channel = supabase
      .channel(`driver_status_${driverId || 'all'}`)
      .on(
        'postgres_changes' as any,
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'drivers',
          ...(filterString && { filter: filterString })
        },
        (payload) => {
          const driver = payload.new as any;
          if (driver) {
            const update: DriverStatusUpdate = {
              driver_id: driver.id,
              is_online: driver.is_online,
              status: driver.status
            };
            onStatusUpdate(update);
          }
        }
      )
      .subscribe();

    channelsRef.current.push(channel);
    setActiveChannels(prev => [...prev, channel]);
    return channel;
  };

  // Subscribe to nearby drivers updates
  const _subscribeToNearbyDrivers = (
    onDriverUpdate: (update: any) => void
  ) => {
    const channel = supabase
      .channel('nearby_drivers')
      .on(
        'postgres_changes' as any,
        {
          event: '*',
          schema: 'public',
          table: 'drivers',
          filter: 'is_online=eq.true'
        },
        (payload) => {
          onDriverUpdate(payload);
        }
      )
      .subscribe();

    channelsRef.current.push(channel);
    setActiveChannels(prev => [...prev, channel]);
    return channel;
  };

  // Update driver location
  const _updateDriverLocation = async (
    latitude: number,
    longitude: number,
    heading?: number,
    speed?: number
  ) => {
    if (!profile || profile.role !== 'driver') {
      console.error('Only drivers can update location');
      return false;
    }

    try {
      const { error } = await supabase
        .from('driver_locations')
        .insert({
          driver_id: profile.id, // This should be the driver's ID, not user ID
          location: `POINT(${longitude} ${latitude})`,
          heading: heading || null,
          speed: speed || null
        });

      if (error) {
        console.error('Error updating location:', error);
        return false;
      }

      // Also update the current_location in drivers table
      const { error: updateError } = await supabase
        .from('drivers')
        .update({
          current_location: `POINT(${longitude} ${latitude})`
        })
        .eq('user_id', profile.id);

      if (updateError) {
        console.error('Error updating driver current location:', updateError);
      }

      return true;
    } catch (error) {
      console.error('Error updating location:', error);
      return false;
    }
  };

  // Send notification
  const _sendNotification = async (
    userId: string,
    title: string,
    message: string,
    type: 'booking' | 'driver' | 'system' = 'system',
    data?: any
  ) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title,
          message,
          type,
          data: data || {},
          is_read: false
        });

      if (error) {
        console.error('Error sending notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  };

  // Mark notification as read
  const _markNotificationAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) {
        console.error('Error marking notification as read:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };

  // Get unread notifications count
  const _getUnreadNotificationsCount = async (userId: string) => {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('is_read', false);

      if (error) {
        console.error('Error getting unread notifications count:', error);
        return 0;
      }

      return count || 0;
    } catch (error) {
      console.error('Error getting unread notifications count:', error);
      return 0;
    }
  };

  // Subscribe to messages
  const _subscribeToMessages = (
    userIds: string[],
    onMessage: (message: any) => void
  ) => {
    if (!userIds.length) return null;

    const channel = supabase
      .channel(`messages_${userIds.join('_')}`)
      .on(
        'postgres_changes' as any,
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=in.(${userIds.join(',')}) OR receiver_id=in.(${userIds.join(',')})`
        },
        (payload) => {
          const message = payload.new as any;
          if (message) {
            onMessage(message);
          }
        }
      )
      .subscribe();

    channelsRef.current.push(channel);
    setActiveChannels(prev => [...prev, channel]);
    return channel;
  };

  // Send message
  const _sendMessage = async (receiverId: string, message: string) => {
    if (!user?.id) {
      console.error('User not authenticated');
      return false;
    }

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: receiverId,
          message,
          is_read: false
        });

      if (error) {
        console.error('Error sending message:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };

  // Setup connection status monitoring
  useEffect(() => {
    const channel = supabase
      .channel('connection_status')
      .on('system' as any, { event: 'disconnect' }, () => {
        setIsConnected(false);
        toast.error('Connection lost. Trying to reconnect...');
      })
      .on('system' as any, { event: 'reconnect' }, () => {
        setIsConnected(true);
        toast.success('Reconnected successfully!');
      })
      .subscribe();

    setIsConnected(true);

    return () => {
      cleanup();
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    isConnected,
    activeChannels,
    subscribeToDriverLocations: _subscribeToDriverLocations,
    subscribeToBookings: _subscribeToBookings,
    subscribeToDriverStatus: _subscribeToDriverStatus,
    subscribeToNearbyDrivers: _subscribeToNearbyDrivers,
    updateDriverLocation: _updateDriverLocation,
    sendNotification: _sendNotification,
    markNotificationAsRead: _markNotificationAsRead,
    getUnreadNotificationsCount: _getUnreadNotificationsCount,
    subscribeToMessages: _subscribeToMessages,
    sendMessage: _sendMessage,
    cleanup
  };
}
