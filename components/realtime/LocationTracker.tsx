'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useRealtime } from '@/hooks/useRealtime';
import { useAuth } from '@/hooks/useAuth';
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
  const { profile } = useAuth();
  const { updateDriverLocation, subscribeToDriverLocations, isConnected } = useRealtime();
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const watchIdRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Start location tracking for drivers
  const _startTracking = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser');
      return;
    }

    setIsTracking(true);
    setIsUpdating(true);

    const _options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const _successCallback = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      const now = Date.now();

      // Only update if it's been more than 5 seconds since last update
      if (now - lastUpdateRef.current > 5000) {
        setCurrentLocation({ lat: latitude, lng: longitude });
        lastUpdateRef.current = now;

        if (isDriver && profile) {
          updateDriverLocation(latitude, longitude, position.coords.heading || undefined, position.coords.speed || undefined)
            .then((success) => {
              if (success) {
                // console.log('Location updated successfully');
              } else {
                toast.error('Failed to update location');
              }
            })
            .catch((error) => {
              console.error('Error updating location:', error);
              toast.error('Error updating location');
            });
        }

        onLocationUpdate?.({ lat: latitude, lng: longitude });
      }
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
  };

  // Stop location tracking
  const _stopTracking = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsTracking(false);
    setIsUpdating(false);
  };

  // Subscribe to driver location updates (for users tracking drivers)
  useEffect(() => {
    if (!isDriver && driverId) {
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
  }, [isDriver, driverId, subscribeToDriverLocations, onLocationUpdate]);

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
      className={`bg-white rounded-xl shadow-lg p-4 border border-gray-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm font-medium text-gray-700">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        {isDriver && (
          <div className="flex items-center space-x-2">
            {isTracking ? (
              <motion.div
                className="w-2 h-2 bg-green-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            ) : (
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            )}
            <span className="text-sm text-gray-600">
              {isTracking ? 'Tracking' : 'Not Tracking'}
            </span>
          </div>
        )}
      </div>

      {isDriver ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Location Tracking</span>
            <button
              onClick={isTracking ? _stopTracking : _startTracking}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isTracking
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isUpdating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isTracking ? (
                'Stop Tracking'
              ) : (
                'Start Tracking'
              )}
            </button>
          </div>

          {currentLocation && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Current Location</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Latitude: {currentLocation.lat.toFixed(6)}</div>
                <div>Longitude: {currentLocation.lng.toFixed(6)}</div>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Navigation className="w-4 h-4" />
            <span>Location updates every 5 seconds when tracking is active</span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Driver Location</span>
          </div>

          {currentLocation ? (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-600 space-y-1">
                <div>Latitude: {currentLocation.lat.toFixed(6)}</div>
                <div>Longitude: {currentLocation.lng.toFixed(6)}</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <WifiOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Waiting for driver location...</p>
            </div>
          )}
        </div>
      )}

      {!isConnected && (
        <motion.div
          className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center space-x-2">
            <WifiOff className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">Connection lost. Trying to reconnect...</span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
