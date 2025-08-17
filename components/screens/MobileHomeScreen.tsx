'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, MapPin, Star, Users, Shield, ArrowRight, Phone, MessageCircle, Sparkles, Zap, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { BookingForm } from '@/components/forms/BookingForm';

interface MobileHomeScreenProps {
  onNavigateToBooking?: () => void;
}

export function MobileHomeScreen({ onNavigateToBooking }: MobileHomeScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const features = [
    {
      icon: MapPin,
      title: 'Location Based',
      description: 'Find nearby drivers instantly',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      gradient: 'from-blue-400 to-blue-600'
    },
    {
      icon: Star,
      title: 'Verified Drivers',
      description: 'All drivers are background checked',
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-50',
      gradient: 'from-yellow-400 to-orange-500'
    },
    {
      icon: Users,
      title: 'Direct Contact',
      description: 'Negotiate directly with drivers',
      color: 'text-green-500',
      bgColor: 'bg-green-50',
      gradient: 'from-green-400 to-emerald-600'
    },
    {
      icon: Shield,
      title: 'Safe & Secure',
      description: 'Your safety is our priority',
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      gradient: 'from-purple-400 to-indigo-600'
    }
  ];

  const quickActions = [
    {
      title: 'Book Now',
      subtitle: 'Find a ride',
      icon: Car,
      color: 'bg-gradient-to-br from-primary-500 to-primary-600',
      shadow: 'shadow-lg shadow-primary-500/25',
      onClick: () => setShowBookingForm(true)
    },
    {
      title: 'Become Driver',
      subtitle: 'Join our fleet',
      icon: Users,
      color: 'bg-gradient-to-br from-secondary-500 to-secondary-600',
      shadow: 'shadow-lg shadow-secondary-500/25',
      onClick: () => {/* Navigate to driver registration */}
    }
  ];

  const recentDrivers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      rating: 4.8,
      vehicle: 'Toyota Innova',
      distance: '0.5 km',
      phone: '+91 98765 43210',
      whatsapp: '+91 98765 43210',
      avatar: 'R',
      isOnline: true,
      badge: 'Top Rated'
    },
    {
      id: 2,
      name: 'Sunil Patel',
      rating: 4.9,
      vehicle: 'Maruti Swift',
      distance: '1.2 km',
      phone: '+91 98765 43211',
      whatsapp: '+91 98765 43211',
      avatar: 'S',
      isOnline: true,
      badge: 'Verified'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <AnimatePresence mode="wait">
        {!showBookingForm ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 p-4"
          >
            {/* Enhanced Hero Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 rounded-3xl p-6 text-white overflow-hidden"
            >
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-4 right-4 w-24 h-24 bg-white rounded-full"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-4 left-4 w-20 h-20 bg-white rounded-full"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white rounded-full opacity-5" />
              </div>

              {/* Floating Elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 right-6"
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
                  >
                    <Car className="w-7 h-7 text-white" />
                  </motion.div>
                  <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                      Goa Taxi
                    </h1>
                    <p className="text-sm opacity-90 flex items-center gap-1">
                      <Zap className="w-3 h-3 text-yellow-300" />
                      Your trusted ride partner
                    </p>
                  </div>
                </div>

                <p className="text-xl font-medium mb-8 leading-relaxed">
                  Book your perfect ride in Goa with just a few taps
                </p>

                <div className="flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowBookingForm(true)}
                    className="flex-1 bg-white text-primary-600 font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Car className="w-5 h-5" />
                    Book Now
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="border-2 border-white text-white font-semibold py-4 px-6 rounded-2xl hover:bg-white hover:text-primary-600 transition-all duration-200"
                  >
                    Learn More
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Enhanced Quick Actions */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              {quickActions.map((action, index) => (
                <motion.button
                  key={action.title}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={action.onClick}
                  className={`${action.color} ${action.shadow} text-white p-6 rounded-3xl text-left transition-all duration-300 hover:shadow-xl`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <action.icon className="w-5 h-5" />
                    </div>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                  </div>
                  <div className="font-bold text-lg">{action.title}</div>
                  <div className="text-sm opacity-90">{action.subtitle}</div>
                </motion.button>
              ))}
            </motion.div>

            {/* Enhanced Features Carousel */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold">Why Choose Us</h2>
              </div>
              
              <div className="relative">
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex-shrink-0 w-44"
                    >
                      <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                        <feature.icon className={`w-7 h-7 ${feature.color}`} />
                      </div>
                      <h3 className="font-bold mb-2 text-gray-900">{feature.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Enhanced Recent Drivers */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-white" />
                  </div>
                  <h2 className="text-xl font-bold">Nearby Drivers</h2>
                </div>
                <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>

              <div className="space-y-4">
                {recentDrivers.map((driver, index) => (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {driver.avatar}
                          </span>
                        </div>
                        {driver.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-gray-900">{driver.name}</h3>
                          {driver.badge && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">
                              {driver.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{driver.vehicle}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-semibold">{driver.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">• {driver.distance}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={() => window.open(`tel:${driver.phone}`)}
                      >
                        <Phone className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={() => window.open(`https://wa.me/${driver.whatsapp.replace(/\s/g, '')}`)}
                      >
                        <MessageCircle className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Enhanced Stats Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-500 rounded-3xl p-6 text-white shadow-xl"
            >
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold">Goa Taxi Stats</h2>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">500+</div>
                  <div className="text-sm opacity-90">Drivers</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">10K+</div>
                  <div className="text-sm opacity-90">Rides</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold mb-1">4.8★</div>
                  <div className="text-sm opacity-90">Rating</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="booking"
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-white"
          >
            <BookingForm />
            
            <div className="p-4">
              <Button
                onClick={() => setShowBookingForm(false)}
                variant="outline"
                className="w-full"
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
