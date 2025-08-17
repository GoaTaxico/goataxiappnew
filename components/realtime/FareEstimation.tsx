'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Car, Clock, Users, Calculator, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface FareEstimationProps {
  pickupLocation: string;
  dropLocation: string;
  pickupCoordinates?: { lat: number; lng: number };
  dropCoordinates?: { lat: number; lng: number };
  vehicleType: string;
  passengerCount: number;
  onFareCalculated: (fare: FareDetails) => void;
  className?: string;
}

interface FareDetails {
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  surgeMultiplier: number;
  totalFare: number;
  distance: number;
  duration: number;
  currency: string;
}

const VEHICLE_RATES = {
  hatchback: {
    base: 50,
    perKm: 12,
    perMinute: 2,
    capacity: 4,
  },
  sedan: {
    base: 60,
    perKm: 15,
    perMinute: 2.5,
    capacity: 4,
  },
  suv: {
    base: 80,
    perKm: 18,
    perMinute: 3,
    capacity: 6,
  },
};

export function FareEstimation({
  pickupLocation,
  dropLocation,
  pickupCoordinates,
  dropCoordinates,
  vehicleType,
  passengerCount,
  onFareCalculated,
  className = '',
}: FareEstimationProps) {
  const [fareDetails, setFareDetails] = useState<FareDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (pickupCoordinates && dropCoordinates) {
      calculateFare();
    }
  }, [pickupCoordinates, dropCoordinates, vehicleType, passengerCount]);

  const calculateFare = async () => {
    if (!pickupCoordinates || !dropCoordinates) {
      toast.error('Please select pickup and drop locations');
      return;
    }

    setIsLoading(true);

    try {
      // Calculate distance using Haversine formula
      const distance = calculateDistance(
        pickupCoordinates.lat,
        pickupCoordinates.lng,
        dropCoordinates.lat,
        dropCoordinates.lng
      );

      // Estimate duration (assuming average speed of 30 km/h in city)
      const duration = Math.ceil(distance / 0.5); // 30 km/h = 0.5 km/min

      // Get vehicle rates
      const rates = VEHICLE_RATES[vehicleType as keyof typeof VEHICLE_RATES] || VEHICLE_RATES.sedan;

      // Calculate fare components
      const baseFare = rates.base;
      const distanceFare = distance * rates.perKm;
      const timeFare = duration * rates.perMinute;

      // Calculate surge multiplier based on time and demand
      const surgeMultiplier = calculateSurgeMultiplier();

      const totalFare = (baseFare + distanceFare + timeFare) * surgeMultiplier;

      const fare: FareDetails = {
        baseFare,
        distanceFare: Math.round(distanceFare),
        timeFare: Math.round(timeFare),
        surgeMultiplier,
        totalFare: Math.round(totalFare),
        distance: Math.round(distance * 10) / 10, // Round to 1 decimal
        duration,
        currency: 'INR',
      };

      setFareDetails(fare);
      onFareCalculated(fare);

    } catch (error) {
      console.error('Error calculating fare:', error);
      toast.error('Failed to calculate fare');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const calculateSurgeMultiplier = (): number => {
    const now = new Date();
    const hour = now.getHours();
    
    // Peak hours: 7-10 AM and 5-8 PM
    const isPeakHour = (hour >= 7 && hour <= 10) || (hour >= 17 && hour <= 20);
    
    // Weekend surge
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    
    let multiplier = 1.0;
    
    if (isPeakHour) multiplier += 0.2;
    if (isWeekend) multiplier += 0.1;
    
    // Random demand factor (simulating real-world conditions)
    const demandFactor = 0.9 + Math.random() * 0.3; // 0.9 to 1.2
    
    return Math.min(multiplier * demandFactor, 2.0); // Cap at 2x
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="flex items-center justify-center">
          <LoadingSpinner size="lg" className="mr-3" />
          <span className="text-gray-600">Calculating fare...</span>
        </div>
      </div>
    );
  }

  if (!fareDetails) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <Calculator className="w-8 h-8 mx-auto mb-2" />
          <p>Select pickup and drop locations to see fare estimate</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-lg border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Fare Estimate</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
      </div>

      {/* Total Fare */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-gray-900 mb-1">
          {formatCurrency(fareDetails.totalFare)}
        </div>
        <p className="text-sm text-gray-600">
          Estimated fare for {vehicleType} • {passengerCount} passenger{passengerCount > 1 ? 's' : ''}
        </p>
      </div>

      {/* Trip Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            {fareDetails.distance} km
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-600">
            ~{fareDetails.duration} min
          </span>
        </div>
      </div>

      {/* Surge Indicator */}
      {fareDetails.surgeMultiplier > 1.1 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-orange-600" />
            <span className="text-sm text-orange-800">
              Higher demand • {Math.round((fareDetails.surgeMultiplier - 1) * 100)}% surge
            </span>
          </div>
        </div>
      )}

      {/* Fare Breakdown */}
      {showDetails && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="border-t border-gray-200 pt-4 space-y-2"
        >
          <h4 className="font-medium text-gray-900 mb-3">Fare Breakdown</h4>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Base fare</span>
              <span className="font-medium">{formatCurrency(fareDetails.baseFare)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">
                Distance ({fareDetails.distance} km × {VEHICLE_RATES[vehicleType as keyof typeof VEHICLE_RATES]?.perKm || 15})
              </span>
              <span className="font-medium">{formatCurrency(fareDetails.distanceFare)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">
                Time ({fareDetails.duration} min × {VEHICLE_RATES[vehicleType as keyof typeof VEHICLE_RATES]?.perMinute || 2.5})
              </span>
              <span className="font-medium">{formatCurrency(fareDetails.timeFare)}</span>
            </div>
            
            {fareDetails.surgeMultiplier > 1 && (
              <div className="flex justify-between">
                <span className="text-gray-600">
                  Surge multiplier ({fareDetails.surgeMultiplier.toFixed(1)}×)
                </span>
                <span className="font-medium text-orange-600">
                  +{formatCurrency(Math.round((fareDetails.baseFare + fareDetails.distanceFare + fareDetails.timeFare) * (fareDetails.surgeMultiplier - 1)))}
                </span>
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">{formatCurrency(fareDetails.totalFare)}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <div className="text-xs text-gray-500 mt-4 pt-4 border-t border-gray-100">
        <p>• Final fare may vary based on actual route and traffic conditions</p>
        <p>• Payment to be made directly to the driver</p>
        <p>• No booking fees or hidden charges</p>
      </div>
    </motion.div>
  );
}
