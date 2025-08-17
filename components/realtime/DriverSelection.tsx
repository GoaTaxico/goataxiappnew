'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Star, Car, Phone, MessageCircle, Clock, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useRealtime } from '@/hooks/useRealtime';
import toast from 'react-hot-toast';

interface Driver {
  id: string;
  user_id: string;
  vehicle_type: string;
  vehicle_number: string;
  license_number: string;
  is_available: boolean;
  current_location: any;
  rating: number;
  total_rides: number;
  profile: {
    id: string;
    full_name: string;
    avatar_url: string;
    phone: string;
  };
  distance?: number;
  eta?: number;
}

interface DriverSelectionProps {
  bookingId: string;
  pickupLocation: string;
  dropLocation: string;
  vehicleType: string;
  passengerCount: number;
  onDriverSelect: (driver: Driver) => void;
  onCancel: () => void;
}

export function DriverSelection({
  bookingId,
  pickupLocation,
  dropLocation,
  vehicleType,
  passengerCount,
  onDriverSelect,
  onCancel,
}: DriverSelectionProps) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { subscribeToDriverLocations } = useRealtime();

  useEffect(() => {
    fetchNearbyDrivers();
  }, []);

  const fetchNearbyDrivers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/drivers/nearby?vehicle_type=${vehicleType}&passenger_count=${passengerCount}`);
      const data = await response.json();

      if (response.ok) {
        setDrivers(data.data || []);
        
        // Subscribe to real-time location updates for each driver
        data.data?.forEach((driver: Driver) => {
          subscribeToDriverLocations([driver.id], (locationUpdate) => {
            setDrivers(prev => prev.map(d => 
              d.id === driver.id 
                ? { ...d, current_location: locationUpdate.location }
                : d
            ));
          });
        });
      } else {
        toast.error('Failed to fetch nearby drivers');
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
      toast.error('Failed to fetch nearby drivers');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDriverSelect = async (driver: Driver) => {
    try {
      setIsSearching(true);
      
      // Assign driver to booking
      const response = await fetch(`/api/bookings/${bookingId}/assign-driver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ driver_id: driver.id }),
      });

      if (response.ok) {
        setSelectedDriver(driver);
        onDriverSelect(driver);
        toast.success(`Driver ${driver.profile.full_name} assigned to your booking!`);
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to assign driver');
      }
    } catch (error) {
      console.error('Error assigning driver:', error);
      toast.error('Failed to assign driver');
    } finally {
      setIsSearching(false);
    }
  };

  const handleRefresh = () => {
    fetchNearbyDrivers();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mb-4" />
          <p className="text-gray-600">Finding nearby drivers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Available Drivers
        </h2>
        <p className="text-gray-600">
          {drivers.length} drivers found near your pickup location
        </p>
      </div>

      {/* Booking Summary */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">Booking Summary</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-blue-700"><MapPin className="inline w-4 h-4 mr-1" />Pickup: {pickupLocation}</p>
            <p className="text-blue-700"><MapPin className="inline w-4 h-4 mr-1" />Drop: {dropLocation}</p>
          </div>
          <div>
            <p className="text-blue-700"><Car className="inline w-4 h-4 mr-1" />Vehicle: {vehicleType}</p>
            <p className="text-blue-700"><Users className="inline w-4 h-4 mr-1" />Passengers: {passengerCount}</p>
          </div>
        </div>
      </div>

      {/* Drivers List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Nearby Drivers</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isSearching}
          >
            <Clock className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        <AnimatePresence>
          {drivers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
            >
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No drivers available at the moment</p>
              <Button onClick={handleRefresh} variant="outline">
                Try Again
              </Button>
            </motion.div>
          ) : (
            drivers.map((driver, index) => (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  {/* Driver Info */}
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      {driver.profile.avatar_url ? (
                        <img
                          src={driver.profile.avatar_url}
                          alt={driver.profile.full_name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <Car className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900">
                          {driver.profile.full_name}
                        </h4>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">
                            {driver.rating.toFixed(1)} ({driver.total_rides} rides)
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><Car className="inline w-3 h-3 mr-1" />{driver.vehicle_type} • {driver.vehicle_number}</p>
                        <p><MapPin className="inline w-3 h-3 mr-1" />{driver.current_location}</p>
                        {driver.distance && (
                          <p className="text-blue-600">
                            {driver.distance.toFixed(1)} km away
                            {driver.eta && ` • ${driver.eta} min ETA`}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col space-y-2">
                    <Button
                      size="sm"
                      onClick={() => handleDriverSelect(driver)}
                      disabled={isSearching || selectedDriver?.id === driver.id}
                      className="min-w-24"
                    >
                      {isSearching && selectedDriver?.id === driver.id ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Assigning...
                        </>
                      ) : (
                        'Select Driver'
                      )}
                    </Button>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`tel:${driver.profile.phone}`)}
                        className="flex-1"
                      >
                        <Phone className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {/* TODO: Implement chat */}}
                        className="flex-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Cancel Button */}
      <div className="text-center pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSearching}
        >
          Cancel Booking
        </Button>
      </div>
    </div>
  );
}
