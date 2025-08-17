'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Car, Clock, Users, Phone, MessageCircle, CheckCircle, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ChatSystem } from '@/components/realtime/ChatSystem';
import { useRealtime } from '@/hooks/useRealtime';
import { logError } from '@/utils/logger';
import { openNavigation } from '@/utils/navigation';
import toast from 'react-hot-toast';

interface Driver {
  id: string;
  user_id: string;
  vehicle_type: string;
  vehicle_number: string;
  license_number: string;
  is_available: boolean;
  current_location: string;
  rating: number;
  total_rides: number;
  profile: {
    id: string;
    full_name: string;
    avatar_url?: string;
    phone: string;
  };
  distance?: number;
  eta?: number;
}

interface BookingConfirmationProps {
  bookingId: string;
  booking: {
    id: string;
    vehicle_type: string;
    pickup_location: string;
    drop_location: string;
    pickup_date: string;
    pickup_time: string;
    passenger_count: number;
    notes?: string;
    status: string;
    created_at: string;
  };
  driver: Driver;
  fare: {
    totalFare: number;
    distance: number;
    duration: number;
    currency: string;
  };
  onCancel: () => void;
  onComplete: () => void;
}

export function BookingConfirmation({
  bookingId,
  booking,
  driver,
  fare,
  onCancel,
  onComplete,
}: BookingConfirmationProps) {
  const [currentStatus, setCurrentStatus] = useState(booking.status);
  const [driverLocation, setDriverLocation] = useState(driver.current_location);
  const [eta, setEta] = useState(driver.eta || 0);
  const [isLoading, setIsLoading] = useState(false);
  const { subscribeToDriverLocations, subscribeToBookings } = useRealtime();

  const handleLocationUpdate = useCallback((update: any) => {
    if (update.driver_id === driver.id) {
      setDriverLocation(update.location);
    }
  }, [driver.id]);

  const handleStatusUpdate = useCallback((update: any) => {
    if (update.id === bookingId) {
      setCurrentStatus(update.status);
      if (update.status === 'completed') {
        onComplete();
      }
    }
  }, [bookingId, onComplete]);

  useEffect(() => {
    // Subscribe to driver location updates
    const locationChannel = subscribeToDriverLocations([driver.id], handleLocationUpdate);

    // Subscribe to booking status updates
    const bookingChannel = subscribeToBookings(handleStatusUpdate);

    // Update ETA every minute
    const etaInterval = setInterval(() => {
      if (eta > 0) {
        setEta(prev => Math.max(0, prev - 1));
      }
    }, 60000);

    return () => {
      clearInterval(etaInterval);
    };
  }, [bookingId, driver.id, eta, subscribeToDriverLocations, subscribeToBookings, handleLocationUpdate, handleStatusUpdate]);

  const handleCancelBooking = async () => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Booking cancelled successfully');
        onCancel();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to cancel booking');
      }
    } catch (error) {
      logError('Error cancelling booking', error as Error, undefined, 'BookingConfirmation');
      toast.error('Failed to cancel booking');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCallDriver = () => {
    window.open(`tel:${driver.profile.phone}`);
  };

  const handleMessageDriver = () => {
    // Open chat with driver
    const chatSystem = document.getElementById('chat-system');
    if (chatSystem) {
      chatSystem.style.display = 'block';
    }
  };

  const handleNavigateToDriver = () => {
    // Parse driver location coordinates
    const locationMatch = driver.current_location?.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
    if (locationMatch) {
      const coordinates = {
        lat: parseFloat(locationMatch[1]),
        lng: parseFloat(locationMatch[2])
      };
      
      openNavigation(coordinates, {
        name: `${driver.profile.full_name || 'Driver'}'s Location`,
        address: driver.current_location || ''
      });
    } else {
      // Fallback to Google Maps search
      const searchQuery = encodeURIComponent(driver.current_location);
      window.open(`https://www.google.com/maps/search/${searchQuery}`, '_blank');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'assigned':
        return 'text-blue-600 bg-blue-50';
      case 'in_progress':
        return 'text-green-600 bg-green-50';
      case 'completed':
        return 'text-green-600 bg-green-50';
      case 'cancelled':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Finding Driver';
      case 'assigned':
        return 'Driver Assigned';
      case 'in_progress':
        return 'Ride in Progress';
      case 'completed':
        return 'Ride Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h2>
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentStatus)}`}>
          {getStatusText(currentStatus)}
        </div>
      </div>

      {/* Driver Info */}
      <div className="bg-blue-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-900 mb-3">Your Driver</h3>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
            {driver.profile.avatar_url ? (
              <Image
                src={driver.profile.avatar_url}
                alt={driver.profile.full_name || 'Driver'}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <Car className="w-6 h-6 text-blue-600" />
            )}
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-blue-900">
              {driver.profile.full_name}
            </h4>
            <p className="text-sm text-blue-700">
              {driver.vehicle_type} • {driver.vehicle_number}
            </p>
            <p className="text-sm text-blue-600">
              ⭐ {driver.rating.toFixed(1)} ({driver.total_rides} rides)
            </p>
          </div>

          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleCallDriver}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Phone className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleMessageDriver}
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {eta > 0 && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-sm text-blue-700">
              <Clock className="inline w-4 h-4 mr-1" />
              ETA: {eta} minutes
            </p>
            <p className="text-sm text-blue-600">
              <MapPin className="inline w-4 h-4 mr-1" />
              {driverLocation}
            </p>
          </div>
        )}
      </div>

      {/* Trip Details */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-gray-900">Trip Details</h3>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600"><MapPin className="inline w-4 h-4 mr-1" />Pickup</p>
            <p className="font-medium">{booking.pickup_location}</p>
          </div>
          <div>
            <p className="text-gray-600"><MapPin className="inline w-4 h-4 mr-1" />Drop</p>
            <p className="font-medium">{booking.drop_location}</p>
          </div>
          <div>
            <p className="text-gray-600"><Car className="inline w-4 h-4 mr-1" />Vehicle</p>
            <p className="font-medium">{booking.vehicle_type}</p>
          </div>
          <div>
            <p className="text-gray-600"><Users className="inline w-4 h-4 mr-1" />Passengers</p>
            <p className="font-medium">{booking.passenger_count}</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Estimated Fare</span>
            <span className="text-lg font-semibold text-gray-900">
              {formatCurrency(fare.totalFare)}
            </span>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{fare.distance} km</span>
            <span>~{fare.duration} min</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button
          onClick={handleNavigateToDriver}
          className="w-full"
          variant="outline"
        >
          <Navigation className="w-4 h-4 mr-2" />
          Navigate to Driver
        </Button>

        <Button
          onClick={handleCancelBooking}
          disabled={isLoading || currentStatus === 'completed'}
          className="w-full"
          variant="outline"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              Cancelling...
            </>
          ) : (
            'Cancel Booking'
          )}
        </Button>
      </div>

      {/* Status Updates */}
      {currentStatus === 'in_progress' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            🚗 Your driver is on the way! You can track their location in real-time.
          </p>
        </div>
      )}

      {/* Booking Notes */}
      {booking.notes && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            <strong>Notes:</strong> {booking.notes}
          </p>
        </div>
      )}
      
      {/* Chat System */}
      <div id="chat-system" style={{ display: 'none' }}>
        <ChatSystem
          receiverId={driver.id}
          receiverName={driver.profile.full_name}
          receiverRole="driver"
        />
      </div>
    </motion.div>
  );
}
