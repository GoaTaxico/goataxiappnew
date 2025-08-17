'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Check, Car, MapPin, Calendar, Clock, Users, Sparkles, Star } from 'lucide-react';
import { BookingForm } from '@/components/forms/BookingForm';
import { Button } from '@/components/ui/Button';

interface MobileBookingScreenProps {
  onBack?: () => void;
}

export function MobileBookingScreen({ onBack }: MobileBookingScreenProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    vehicleType: 'sedan',
    pickupLocation: '',
    dropLocation: '',
    date: '',
    time: '',
    passengers: 1
  });

  const steps = [
    { id: 1, title: 'Vehicle', icon: Car, color: 'from-blue-500 to-blue-600' },
    { id: 2, title: 'Location', icon: MapPin, color: 'from-green-500 to-green-600' },
    { id: 3, title: 'Time', icon: Calendar, color: 'from-purple-500 to-purple-600' },
    { id: 4, title: 'Confirm', icon: Check, color: 'from-primary-500 to-secondary-500' }
  ];

  const vehicleTypes = [
    { type: 'hatchback', name: 'Hatchback', icon: '🚗', capacity: 4, price: '₹15/km', features: ['Economical', 'Perfect for city rides'] },
    { type: 'sedan', name: 'Sedan', icon: '🚙', capacity: 4, price: '₹18/km', features: ['Comfortable', 'Best for families'] },
    { type: 'suv', name: 'SUV', icon: '🚐', capacity: 6, price: '₹22/km', features: ['Spacious', 'Great for groups'] }
  ];

  const _renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Car className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose Your Vehicle</h2>
              <p className="text-gray-600">Select the type of vehicle that suits your needs</p>
            </div>
            
            <div className="space-y-4">
              {vehicleTypes.map((vehicle) => (
                <motion.button
                  key={vehicle.type}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setBookingData(prev => ({ ...prev, vehicleType: vehicle.type }));
                    setCurrentStep(2);
                  }}
                  className={`w-full p-6 rounded-3xl border-2 transition-all duration-300 ${
                    bookingData.vehicleType === vehicle.type
                      ? 'border-primary-500 bg-gradient-to-r from-primary-50 to-primary-100 shadow-lg shadow-primary-500/20'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{vehicle.icon}</div>
                      <div className="text-left">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{vehicle.name}</h3>
                        <p className="text-gray-600 mb-2">Up to {vehicle.capacity} passengers</p>
                        <div className="flex gap-2">
                          {vehicle.features.map((feature, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary-600 text-lg">{vehicle.price}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm text-gray-600">4.8</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pickup & Drop</h2>
              <p className="text-gray-600">Enter your pickup and drop locations</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-green-600" />
                  </div>
                  Pickup Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter pickup location"
                    value={bookingData.pickupLocation}
                    onChange={(e) => setBookingData(prev => ({ ...prev, pickupLocation: e.target.value }))}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-lg"
                  />
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-6 h-6 bg-red-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-3 h-3 text-red-600" />
                  </div>
                  Drop Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter drop location"
                    value={bookingData.dropLocation}
                    onChange={(e) => setBookingData(prev => ({ ...prev, dropLocation: e.target.value }))}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 text-lg"
                  />
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(1)}
                className="flex-1 py-4 rounded-2xl border-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(3)}
                disabled={!bookingData.pickupLocation || !bookingData.dropLocation}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Date & Time</h2>
              <p className="text-gray-600">When do you need the ride?</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-purple-600" />
                  </div>
                  Pickup Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={bookingData.date}
                    onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-lg"
                  />
                  <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-purple-500" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-3 h-3 text-blue-600" />
                  </div>
                  Pickup Time
                </label>
                <div className="relative">
                  <input
                    type="time"
                    value={bookingData.time}
                    onChange={(e) => setBookingData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                  />
                  <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-500" />
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                  <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Users className="w-3 h-3 text-orange-600" />
                  </div>
                  Number of Passengers
                </label>
                <div className="relative">
                  <select
                    value={bookingData.passengers}
                    onChange={(e) => setBookingData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200 text-lg appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'passenger' : 'passengers'}
                      </option>
                    ))}
                  </select>
                  <Users className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-orange-500" />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 border-l-2 border-b-2 border-gray-400 rotate-45" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
                className="flex-1 py-4 rounded-2xl border-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => setCurrentStep(4)}
                disabled={!bookingData.date || !bookingData.time}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Check className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Booking</h2>
              <p className="text-gray-600">Review your booking details</p>
            </div>
            
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 space-y-4 border border-gray-100 shadow-lg">
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl">
                <span className="text-gray-600 font-medium">Vehicle Type:</span>
                <span className="font-bold text-gray-900">
                  {vehicleTypes.find(v => v.type === bookingData.vehicleType)?.name}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl">
                <span className="text-gray-600 font-medium">Pickup:</span>
                <span className="font-bold text-gray-900">{bookingData.pickupLocation}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl">
                <span className="text-gray-600 font-medium">Drop:</span>
                <span className="font-bold text-gray-900">{bookingData.dropLocation}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl">
                <span className="text-gray-600 font-medium">Date:</span>
                <span className="font-bold text-gray-900">{bookingData.date}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl">
                <span className="text-gray-600 font-medium">Time:</span>
                <span className="font-bold text-gray-900">{bookingData.time}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white rounded-2xl">
                <span className="text-gray-600 font-medium">Passengers:</span>
                <span className="font-bold text-gray-900">{bookingData.passengers}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(3)}
                className="flex-1 py-4 rounded-2xl border-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={() => {
                  // Handle booking submission
                  // console.log('Booking submitted:', bookingData);
                }}
                className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Confirm Booking
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Enhanced Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </motion.button>
          
          <h1 className="font-bold text-xl text-gray-900">Book a Ride</h1>
          
          <div className="w-12"></div> {/* Spacer for centering */}
        </div>

        {/* Enhanced Progress Steps */}
        <div className="flex items-center justify-between mt-6">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-2xl ${
                currentStep >= step.id 
                  ? `bg-gradient-to-br ${step.color} text-white shadow-lg` 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-1 mx-3 rounded-full ${
                  currentStep > step.id ? `bg-gradient-to-r ${step.color}` : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {_renderStepContent()}
        </AnimatePresence>
      </div>
    </div>
  );
}
