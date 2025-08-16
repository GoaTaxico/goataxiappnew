'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Car, MapPin, Calendar, Clock, Users, Search } from 'lucide-react';
import { VehicleType, BookingFormData } from '@/types';
import { getVehicleTypeLabel, getVehicleTypeIcon, getVehicleCapacity } from '@/utils';
import { LocationAutocomplete } from '@/components/ui/LocationAutocomplete';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface BookingFormProps {
  className?: string;
}

export function BookingForm({ className = '' }: BookingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleType>('sedan');
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropLocation, setDropLocation] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<BookingFormData>({
    defaultValues: {
      vehicle_type: 'sedan',
      pickup_location: '',
      drop_location: '',
      pickup_date: new Date().toISOString().split('T')[0],
      pickup_time: new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      }),
      passenger_count: 1,
      notes: '',
    },
  });

  const passengerCount = watch('passenger_count');
  const maxPassengers = getVehicleCapacity(selectedVehicle);

  const vehicleTypes: { type: VehicleType; label: string; icon: string; capacity: number }[] = [
    { type: 'hatchback', label: 'Hatchback', icon: '🚗', capacity: 4 },
    { type: 'sedan', label: 'Sedan', icon: '🚙', capacity: 4 },
    { type: 'suv', label: 'SUV', icon: '🚐', capacity: 6 },
  ];

  const onSubmit = async (data: BookingFormData) => {
    if (!pickupLocation || !dropLocation) {
      toast.error('Please select pickup and drop locations');
      return;
    }

    setIsLoading(true);
    try {
      // Here you would typically make an API call to create the booking
      console.log('Booking data:', {
        ...data,
        pickup_location: pickupLocation,
        drop_location: dropLocation,
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast.success('Booking request submitted! Finding nearby drivers...');
      
      // Redirect to driver selection page
      // router.push(`/drivers?booking=${encodeURIComponent(JSON.stringify(data))}`);
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`card shadow-strong ${className}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Vehicle Type Selection */}
        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <Car className="w-5 h-5" />
            Select Vehicle Type
          </label>
          <div className="grid grid-cols-3 gap-4">
            {vehicleTypes.map((vehicle) => (
              <motion.button
                key={vehicle.type}
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setSelectedVehicle(vehicle.type);
                  setValue('vehicle_type', vehicle.type);
                }}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  selectedVehicle === vehicle.type
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="text-2xl mb-2">{vehicle.icon}</div>
                <div className="font-medium">{vehicle.label}</div>
                <div className="text-sm text-gray-500">
                  Up to {vehicle.capacity} passengers
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Location Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup Location */}
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-500" />
              Pickup Location
            </label>
            <LocationAutocomplete
              placeholder="Enter pickup location"
              value={pickupLocation}
              onChange={setPickupLocation}
              className="input-field"
            />
            {errors.pickup_location && (
              <p className="form-error">{errors.pickup_location.message}</p>
            )}
          </div>

          {/* Drop Location */}
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              Drop Location
            </label>
            <LocationAutocomplete
              placeholder="Enter drop location"
              value={dropLocation}
              onChange={setDropLocation}
              className="input-field"
            />
            {errors.drop_location && (
              <p className="form-error">{errors.drop_location.message}</p>
            )}
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pickup Date */}
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Pickup Date
            </label>
            <input
              type="date"
              {...register('pickup_date', {
                required: 'Pickup date is required',
                min: {
                  value: new Date().toISOString().split('T')[0],
                  message: 'Pickup date cannot be in the past',
                },
              })}
              className="input-field"
            />
            {errors.pickup_date && (
              <p className="form-error">{errors.pickup_date.message}</p>
            )}
          </div>

          {/* Pickup Time */}
          <div className="form-group">
            <label className="form-label flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pickup Time
            </label>
            <input
              type="time"
              {...register('pickup_time', {
                required: 'Pickup time is required',
              })}
              className="input-field"
            />
            {errors.pickup_time && (
              <p className="form-error">{errors.pickup_time.message}</p>
            )}
          </div>
        </div>

        {/* Passenger Count */}
        <div className="form-group">
          <label className="form-label flex items-center gap-2">
            <Users className="w-5 h-5" />
            Number of Passengers
          </label>
          <div className="flex items-center gap-4">
            <select
              {...register('passenger_count', {
                required: 'Passenger count is required',
                min: { value: 1, message: 'Minimum 1 passenger' },
                max: { value: maxPassengers, message: `Maximum ${maxPassengers} passengers for ${getVehicleTypeLabel(selectedVehicle)}` },
              })}
              className="input-field max-w-32"
            >
              {Array.from({ length: maxPassengers }, (_, i) => i + 1).map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'passenger' : 'passengers'}
                </option>
              ))}
            </select>
            <span className="text-sm text-gray-500">
              Max capacity: {maxPassengers} passengers
            </span>
          </div>
          {errors.passenger_count && (
            <p className="form-error">{errors.passenger_count.message}</p>
          )}
        </div>

        {/* Additional Notes */}
        <div className="form-group">
          <label className="form-label">Additional Notes (Optional)</label>
          <textarea
            {...register('notes')}
            placeholder="Any special requirements or instructions..."
            rows={3}
            className="input-field resize-none"
          />
        </div>

        {/* Submit Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="pt-4"
        >
          <Button
            type="submit"
            disabled={isLoading || !pickupLocation || !dropLocation}
            className="w-full py-4 text-lg font-semibold"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="spinner w-5 h-5"></div>
                Finding Drivers...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Search className="w-5 h-5" />
                Find Nearby Drivers
              </div>
            )}
          </Button>
        </motion.div>

        {/* Info Text */}
        <div className="text-center text-sm text-gray-500">
          <p>No booking fees • Negotiate directly with drivers • Instant connection</p>
        </div>
      </form>
    </motion.div>
  );
}
