'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle, Car, User, MapPin, Phone, MessageSquare } from 'lucide-react';
import { useRealtime } from '@/hooks/useRealtime';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface BookingStatusTrackerProps {
  bookingId: string;
  className?: string;
}

interface BookingStatus {
  id: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  driver_id?: string;
  user_id: string;
  pickup_location: string;
  drop_location: string;
  estimated_fare: number;
  created_at: string;
  driver?: {
    profile?: {
      full_name: string;
      phone: string;
      whatsapp: string;
    };
    car_name: string;
    car_number: string;
  };
}

export function BookingStatusTracker({ bookingId, className = '' }: BookingStatusTrackerProps) {
  const { user, profile } = useAuth();
  const { subscribeToBookings } = useRealtime();
  const [bookingStatus, setBookingStatus] = useState<BookingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get booking details
  const { bookings } = useBookings();
  const currentBooking = bookings?.find(b => b.id === bookingId);

  useEffect(() => {
    if (currentBooking) {
      setBookingStatus({
        id: currentBooking.id,
        status: currentBooking.status,
        driver_id: currentBooking.driver_id,
        user_id: currentBooking.user_id,
        pickup_location: currentBooking.pickup_location,
        drop_location: currentBooking.drop_location,
        estimated_fare: currentBooking.estimated_fare,
        created_at: currentBooking.created_at,
        driver: currentBooking.driver
      });
      setIsLoading(false);
    }
  }, [currentBooking]);

  // Subscribe to real-time booking updates
  useEffect(() => {
    if (!bookingId) return;

    const _channel = subscribeToBookings(
      (update) => {
        if (update.id === bookingId) {
          setBookingStatus(prev => prev ? { ...prev, ...update }: update);
          
          // Show toast notifications for status changes
          switch (update.status) {
            case 'accepted':
              toast.success('Your booking has been accepted by a driver!');
              break;
            case 'completed':
              toast.success('Your ride has been completed!');
              break;
            case 'cancelled':
              toast.error('Your booking has been cancelled.');
              break;
          }
        }
      },
      { ...(user?.id && { user_id: user.id }) }
    );

    return () => {
      // Cleanup will be handled by useRealtime hook
    };
  }, [bookingId, user?.id, subscribeToBookings]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const _getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5" />;
      case 'accepted':
        return <Car className="w-5 h-5" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const _getStatusMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Looking for a driver...';
      case 'accepted':
        return 'Driver is on the way!';
      case 'completed':
        return 'Ride completed successfully';
      case 'cancelled':
        return 'Booking was cancelled';
      default:
        return 'Unknown status';
    }
  };

  if (isLoading) {
    return (
      <motion.div
        className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading booking status...</span>
        </div>
      </motion.div>
    );
  }

  if (!bookingStatus) {
    return (
      <motion.div
        className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center py-8">
          <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Booking not found</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Status Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getStatusColor(bookingStatus.status)}`}>
            {_getStatusIcon(bookingStatus.status)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Booking Status</h3>
            <p className="text-sm text-gray-600">{_getStatusMessage(bookingStatus.status)}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(bookingStatus.status)}`}>
          {bookingStatus.status.toUpperCase()}
        </div>
      </div>

      {/* Booking Details */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Pickup</p>
              <p className="text-sm text-gray-600">{bookingStatus.pickup_location}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700">Destination</p>
              <p className="text-sm text-gray-600">{bookingStatus.drop_location}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-gray-100">
          <span className="text-sm font-medium text-gray-700">Estimated Fare</span>
          <span className="text-lg font-semibold text-gray-900">₹{bookingStatus.estimated_fare}</span>
        </div>
      </div>

      {/* Driver Information (if assigned) */}
      {bookingStatus.driver && bookingStatus.status !== 'cancelled' && (
        <motion.div
          className="bg-blue-50 rounded-lg p-4 border border-blue-200 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <User className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Your Driver</h4>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Name</span>
              <span className="text-sm font-medium text-blue-900">
                {bookingStatus.driver.profile?.full_name || 'Driver'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Vehicle</span>
              <span className="text-sm font-medium text-blue-900">
                {bookingStatus.driver.car_name} • {bookingStatus.driver.car_number}
              </span>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="flex space-x-2 mt-4">
            {bookingStatus.driver.profile?.phone && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`tel:${bookingStatus.driver?.profile?.phone || ''}`)}
                className="flex-1"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            )}
            
            {bookingStatus.driver.profile?.whatsapp && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://wa.me/${bookingStatus.driver?.profile?.whatsapp || ''}`)}
                className="flex-1"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            )}
          </div>
        </motion.div>
      )}

      {/* Status Timeline */}
      <div className="border-t border-gray-200 pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Status Timeline</h4>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Booking Created</p>
              <p className="text-xs text-gray-500">
                {new Date(bookingStatus.created_at).toLocaleString()}
              </p>
            </div>
          </div>
          
          {bookingStatus.status !== 'pending' && (
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Driver Assigned</p>
                <p className="text-xs text-gray-500">Driver accepted your booking</p>
              </div>
            </div>
          )}
          
          {bookingStatus.status === 'completed' && (
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Ride Completed</p>
                <p className="text-xs text-gray-500">Your journey has ended</p>
              </div>
            </div>
          )}
          
          {bookingStatus.status === 'cancelled' && (
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Booking Cancelled</p>
                <p className="text-xs text-gray-500">This booking was cancelled</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
