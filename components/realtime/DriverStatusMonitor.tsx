'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, WifiOff, MapPin, Car, Clock, Star, Phone, MessageSquare } from 'lucide-react';
import { useRealtime } from '@/hooks/useRealtime';
import { useAuth } from '@/hooks/useAuth';
import { useDrivers } from '@/hooks/useDrivers';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface DriverStatusMonitorProps {
  driverId?: string;
  showLocation?: boolean;
  className?: string;
}

interface DriverStatus {
  id: string;
  is_online: boolean;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  current_location?: { lat: number; lng: number };
  last_seen?: string;
  rating?: number;
  total_rides?: number;
  profile?: {
    full_name: string;
    phone: string;
    whatsapp: string;
    avatar_url?: string;
  };
  car_name?: string;
  car_number?: string;
}

export function DriverStatusMonitor({ 
  driverId, 
  showLocation = true, 
  className = '' 
}: DriverStatusMonitorProps) {
  const { user, profile } = useAuth();
  const { subscribeToDriverStatus, subscribeToDriverLocations, isConnected } = useRealtime();
  const [driverStatus, setDriverStatus] = useState<DriverStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get driver data
  const { drivers } = useDrivers();
  const currentDriver = drivers?.find(d => d.id === driverId);

  useEffect(() => {
    if (currentDriver) {
      setDriverStatus({
        id: currentDriver.id,
        is_online: currentDriver.is_online,
        status: currentDriver.status,
        rating: currentDriver.rating,
        total_rides: currentDriver.total_rides,
        profile: currentDriver.profile,
        car_name: currentDriver.car_name,
        car_number: currentDriver.car_number,
        last_seen: currentDriver.updated_at
      });
      setIsLoading(false);
    }
  }, [currentDriver]);

  // Subscribe to driver status updates
  useEffect(() => {
    if (!driverId) return;

    const _statusChannel = subscribeToDriverStatus(
      (update) => {
        if (update.driver_id === driverId) {
          setDriverStatus(prev => prev ? { 
            ...prev, 
            is_online: update.is_online,
            status: update.status
          } : {
            id: driverId,
            is_online: update.is_online,
            status: update.status
          });
          
          // Show toast notifications for status changes
          if (update.is_online) {
            toast.success('Driver is now online!');
          } else {
            toast('Driver is now offline');
          }
        }
      },
      driverId
    );

    // Subscribe to location updates if enabled
    let locationChannel = null;
    if (showLocation) {
      locationChannel = subscribeToDriverLocations([driverId], (update) => {
        setDriverStatus(prev => prev ? { 
          ...prev, 
          current_location: update.location,
          last_seen: update.timestamp
        } : prev);
      });
    }

    return () => {
      if (_statusChannel) {
        // Cleanup will be handled by useRealtime hook
      }
      if (locationChannel) {
        // Cleanup will be handled by useRealtime hook
      }
    };
  }, [driverId, showLocation, subscribeToDriverStatus, subscribeToDriverLocations]);

  const getStatusColor = (isOnline: boolean) => {
    return isOnline ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const _getStatusIcon = (isOnline: boolean) => {
    return isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />;
  };

  const _getStatusMessage = (isOnline: boolean) => {
    return isOnline ? 'Driver is online and available' : 'Driver is currently offline';
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
          <span className="ml-3 text-gray-600">Loading driver status...</span>
        </div>
      </motion.div>
    );
  }

  if (!driverStatus) {
    return (
      <motion.div
        className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center py-8">
          <WifiOff className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Driver not found</p>
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
      {/* Connection Status */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium text-gray-700">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Driver Status Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full ${getStatusColor(driverStatus.is_online)}`}>
            {_getStatusIcon(driverStatus.is_online)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Driver Status</h3>
            <p className="text-sm text-gray-600">{_getStatusMessage(driverStatus.is_online)}</p>
          </div>
        </div>
        
        <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(driverStatus.is_online)}`}>
          {driverStatus.is_online ? 'ONLINE' : 'OFFLINE'}
        </div>
      </div>

      {/* Driver Information */}
      {driverStatus.profile && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{driverStatus.profile.full_name}</h4>
              <p className="text-sm text-gray-600">
                {driverStatus.car_name} • {driverStatus.car_number}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-600">
                {driverStatus.rating?.toFixed(1) || 'N/A'} rating
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Car className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                {driverStatus.total_rides || 0} rides
              </span>
            </div>
          </div>

          {/* Contact Buttons */}
          <div className="flex space-x-2 mt-4">
            {driverStatus.profile.phone && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`tel:${driverStatus.profile?.phone}`)}
                className="flex-1"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call
              </Button>
            )}
            
            {driverStatus.profile.whatsapp && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`https://wa.me/${driverStatus.profile?.whatsapp}`)}
                className="flex-1"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Location Information */}
      {showLocation && driverStatus.current_location && (
        <motion.div
          className="bg-blue-50 rounded-lg p-4 mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3 mb-3">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h4 className="font-medium text-blue-900">Current Location</h4>
          </div>
          
          <div className="text-sm text-blue-700 space-y-1">
            <div>Latitude: {driverStatus.current_location.lat.toFixed(6)}</div>
            <div>Longitude: {driverStatus.current_location.lng.toFixed(6)}</div>
            {driverStatus.last_seen && (
              <div className="flex items-center space-x-2 mt-2">
                <Clock className="w-4 h-4" />
                <span>Last updated: {new Date(driverStatus.last_seen).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Status Details */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Account Status</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            driverStatus.status === 'approved' ? 'bg-green-100 text-green-800' :
            driverStatus.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {driverStatus.status.toUpperCase()}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">Online Status</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            driverStatus.is_online ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {driverStatus.is_online ? 'ONLINE' : 'OFFLINE'}
          </span>
        </div>
        
        {driverStatus.last_seen && (
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Last Activity</span>
            <span className="text-sm text-gray-600">
              {new Date(driverStatus.last_seen).toLocaleString()}
            </span>
          </div>
        )}
      </div>

      {/* Connection Warning */}
      {!isConnected && (
        <motion.div
          className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">Connection lost. Status may not be current.</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
