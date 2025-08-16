'use client';

import { motion } from 'framer-motion';
import { 
  MapPin, 
  Shield, 
  DollarSign, 
  Clock, 
  Users, 
  Star,
  Phone,
  MessageCircle,
  Car,
  CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: MapPin,
    title: 'Location Based',
    description: 'Find nearby drivers instantly with real-time location tracking',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    icon: Shield,
    title: 'Verified Drivers',
    description: 'All drivers are background checked and verified for your safety',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    icon: DollarSign,
    title: 'No Booking Fees',
    description: 'Connect directly with drivers, no hidden charges or booking fees',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    icon: Clock,
    title: 'Instant Connection',
    description: 'Get connected with drivers within seconds of your booking',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    icon: Users,
    title: 'Direct Negotiation',
    description: 'Negotiate your fare directly with drivers for the best price',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    icon: Star,
    title: 'Top Rated',
    description: 'Choose from highly rated drivers with excellent service records',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
];

const benefits = [
  'No booking fees or hidden charges',
  'Direct communication with drivers',
  'Real-time location tracking',
  'Verified and background-checked drivers',
  'Multiple vehicle options',
  '24/7 customer support',
  'Instant booking confirmation',
  'Flexible payment options',
];

export function FeaturesSection() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Features Grid */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            Why Choose Goa Taxi?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Experience the best taxi service in Goa with our unique features designed for your convenience
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="text-center group"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${feature.bgColor} ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Everything you need for a perfect ride
            </h3>
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <Car className="w-16 h-16 mx-auto mb-6 text-white" />
                <h4 className="text-2xl font-bold mb-4">
                  Ready to get started?
                </h4>
                <p className="text-lg mb-6 opacity-90">
                  Book your first ride and experience the difference
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-primary-600 font-semibold py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    Book Now
                  </button>
                  <button className="border-2 border-white text-white font-semibold py-3 px-6 rounded-lg hover:bg-white hover:text-primary-600 transition-colors duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Verified Drivers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">10K+</div>
            <div className="text-gray-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">50K+</div>
            <div className="text-gray-600">Rides Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">4.8★</div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
