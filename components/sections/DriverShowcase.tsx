'use client';

import { motion } from 'framer-motion';
import { Star, MapPin, Phone, MessageCircle, Car } from 'lucide-react';
import { getVehicleTypeIcon, formatRating, getRatingColor, getWhatsAppLink } from '@/utils';

// Mock data for demonstration
const mockDrivers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    avatar: '/api/placeholder/60/60',
    vehicle_type: 'sedan' as const,
    car_name: 'Honda City',
    car_number: 'GA-01-AB-1234',
    rating: 4.8,
    total_rides: 1250,
    distance: '0.5km',
    phone: '+91-9876543210',
    whatsapp: '+91-9876543210',
    is_online: true,
  },
  {
    id: '2',
    name: 'Priya Singh',
    avatar: '/api/placeholder/60/60',
    vehicle_type: 'suv' as const,
    car_name: 'Mahindra XUV500',
    car_number: 'GA-02-CD-5678',
    rating: 4.9,
    total_rides: 890,
    distance: '1.2km',
    phone: '+91-9876543211',
    whatsapp: '+91-9876543211',
    is_online: true,
  },
  {
    id: '3',
    name: 'Amit Patel',
    avatar: '/api/placeholder/60/60',
    vehicle_type: 'hatchback' as const,
    car_name: 'Maruti Swift',
    car_number: 'GA-03-EF-9012',
    rating: 4.7,
    total_rides: 2100,
    distance: '0.8km',
    phone: '+91-9876543212',
    whatsapp: '+91-9876543212',
    is_online: true,
  },
];

export function DriverShowcase() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {mockDrivers.map((driver, index) => (
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
                  src={driver.avatar}
                  alt={driver.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                  driver.is_online ? 'bg-green-500' : 'bg-gray-400'
                }`} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{driver.name}</h3>
                <div className="flex items-center gap-1 text-sm text-gray-500">
                  <Star className={`w-4 h-4 ${getRatingColor(driver.rating)}`} />
                  <span className={getRatingColor(driver.rating)}>
                    {formatRating(driver.rating)}
                  </span>
                  <span className="text-gray-400">({driver.total_rides} rides)</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">{driver.distance}</div>
              <div className="text-xs text-green-600 font-medium">Online</div>
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
              href={`tel:${driver.phone}`}
              className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              <Phone className="w-4 h-4" />
              Call
            </a>
            <a
              href={getWhatsAppLink(driver.whatsapp, `Hi ${driver.name}, I'm interested in booking a ride.`)}
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
