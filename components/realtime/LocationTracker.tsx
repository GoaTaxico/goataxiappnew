'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useRealtime } from '@/hooks/useRealtime';
import toast from 'react-hot-toast';

interface LocationTrackerProps {
  isDriver?: boolean;
  driverId?: string;
  onLocationUpdate?: (location: { lat: number; lng: number }) => void;
  className?: string;
}

export function LocationTracker({
  isDriver = false,
  driverId,
  onLocationUpdate,
  className = '',
}: LocationTrackerProps) {
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const { subscribeToDriverLocations, updateDriverLocation } = useRealtime();

  // Mark as hydrated after first render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const _startTracking = useCallback(() => {
    if (!isHydrated || !navigator.geolocation) {
      toast.error('Geolocation is not supported in this browser');
      return;
    }

    setIsUpdating(true);
    setIsTracking(true);

    const _options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 30000,
    };

    const _successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const location = { lat: latitude, lng: longitude };
      
      setCurrentLocation(location);
      onLocationUpdate?.(location);
      
      // Update driver location in real-time if this is a driver
      if (isDriver) {
        updateDriverLocation(location.lat, location.lng);
      }
      
      setIsUpdating(false);
    };

    const _errorCallback = (error: GeolocationPositionError) => {
      console.error('Geolocation error:', error);
      setIsTracking(false);
      setIsUpdating(false);
      
      switch (error.code) {
        case error.PERMISSION_DENIED:
          toast.error('Location permission denied. Please enable location access.');
          break;
        case error.POSITION_UNAVAILABLE:
          toast.error('Location information unavailable.');
          break;
        case error.TIMEOUT:
          toast.error('Location request timed out.');
          break;
        default:
          toast.error('An unknown error occurred while getting location.');
      }
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      _successCallback,
      _errorCallback,
      _options
    );

    setIsUpdating(false);
  }, [isHydrated, isDriver, onLocationUpdate, updateDriverLocation]);

  // Stop location tracking
  const _stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setIsUpdating(false);
  }, []);

  // Subscribe to driver location updates (for users tracking drivers)
  useEffect(() => {
    if (!isDriver && driverId && isHydrated) {
      const _channel = subscribeToDriverLocations([driverId], (update) => {
        setCurrentLocation(update.location);
        onLocationUpdate?.(update.location);
      });

      return () => {
        if (_channel) {
          // Cleanup will be handled by useRealtime hook
        }
      };
    }
    return undefined;
  }, [isDriver, driverId, subscribeToDriverLocations, onLocationUpdate, isHydrated]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      className={`bg-white rounded-lg shadow-md p-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Location Tracking</h3>
        </div>
        <div className="flex items-center space-x-2">
          {isTracking ? (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600">Tracking</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span className="text-sm text-gray-600">Stopped</span>
            </div>
          )}
        </div>
      </div>

      {currentLocation && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Current Location</p>
              <p className="text-sm font-medium text-gray-900">
                {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
              </p>
            </div>
            <Navigation className="w-4 h-4 text-blue-600" />
          </div>
        </div>
      )}

      {isDriver && (
        <div className="space-y-3">
          <Button
            onClick={isTracking ? _stopTracking : _startTracking}
            disabled={isUpdating || !isHydrated}
            className="w-full"
            variant={isTracking ? "outline" : "primary"}
          >
            {isUpdating ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            ) : isTracking ? (
              <>
                <WifiOff className="w-4 h-4 mr-2" />
                Stop Tracking
              </>
            ) : (
              <>
                <Wifi className="w-4 h-4 mr-2" />
                Start Tracking
              </>
            )}
          </Button>

          {isTracking && (
            <div className="text-xs text-gray-500 text-center">
              Location is being shared with users
            </div>
          )}
        </div>
      )}

      {!isDriver && driverId && (
        <div className="text-sm text-gray-600 text-center">
          {currentLocation ? (
            <div className="flex items-center justify-center space-x-2">
              <MapPin className="w-4 h-4 text-green-600" />
              <span>Driver location updated</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
              <span>Waiting for driver location...</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
