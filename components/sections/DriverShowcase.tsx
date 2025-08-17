'use client';

import { motion } from 'framer-motion';
import { Star, Phone, MessageCircle } from 'lucide-react';
import { getVehicleTypeIcon, formatRating, getRatingColor, getWhatsAppLink } from '@/utils';
import { useNearbyDrivers } from '@/hooks/useDrivers';

export function DriverShowcase() {
  // Get nearby drivers (using Goa coordinates as default)
  const { drivers, isLoading, error } = useNearbyDrivers(15.2993, 74.1240);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card card-hover animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-200 rounded-lg p-3 mb-4 h-16"></div>
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Unable to load drivers at the moment.</p>
      </div>
    );
  }

  if (!drivers || drivers.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No drivers available in your area.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {drivers.slice(0, 6).map((driver: any, index: number) => (
        <motion.div
          key={driver.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ y: -5 }}
          className="card card-hover"
        >
          {/* Driver Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src={driver.profile?.avatar_url || '/api/placeholder/60/60'}
                  alt={driver.profile?.full_name || 'Driver'}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  driver.is_online ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{driver.profile?.full_name || 'Driver'}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className={`w-4 h-4 ${getRatingColor(driver.rating || 0)}`} />
                  <span className={getRatingColor(driver.rating || 0)}>
                    {formatRating(driver.rating || 0)}
                  </span>
                  <span className="text-gray-400">({driver.total_rides || 0} rides)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">{Math.round(driver.distance_meters || 0)}m</div>
              <div className="text-xs text-green-600 font-medium">
                {driver.is_online ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="bg-gray-50 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{getVehicleTypeIcon(driver.vehicle_type)}</span>
              <span className="font-medium text-gray-900">{driver.car_name}</span>
            </div>
            <div className="text-sm text-gray-600">{driver.car_number}</div>
          </div>

          {/* Contact Buttons */}
          <div className="flex gap-2">
            <a
              href={`tel:${driver.profile?.phone || driver.profile?.whatsapp || ''}`}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
            <a
              href={getWhatsAppLink(driver.profile?.whatsapp || '', `Hi ${driver.profile?.full_name || 'Driver'}, I'm interested in booking a ride.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
