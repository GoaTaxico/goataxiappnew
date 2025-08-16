'use client';

import { motion } from 'framer-motion';
import { Car, MapPin, Star, Users, Shield } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        {/* Animated shapes */}
        <motion.div
          className="absolute top-20 left-20 w-32 h-32 bg-white bg-opacity-10 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute top-40 right-32 w-24 h-24 bg-white bg-opacity-10 rounded-full"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
        
        <motion.div
          className="absolute bottom-32 left-32 w-20 h-20 bg-white bg-opacity-10 rounded-full"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo/Brand */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white bg-opacity-20 rounded-full mb-6">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Goa Taxi
            </h1>
            <p className="text-xl md:text-2xl font-light mb-8 opacity-90">
              Your trusted ride partner in Goa
            </p>
          </motion.div>

          {/* Main CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Book Your Perfect Ride
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Connect directly with verified drivers. No booking fees, 
              negotiate your own price. Experience Goa like never before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/book">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Book Now
                </motion.button>
              </Link>
              
              <Link href="/driver-register">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="border-2 border-white text-white font-semibold py-4 px-8 rounded-full text-lg hover:bg-white hover:text-primary-600 transition-all duration-200"
                >
                  Become a Driver
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Location Based</h3>
              <p className="text-sm opacity-80">Find nearby drivers instantly</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Verified Drivers</h3>
              <p className="text-sm opacity-80">All drivers are background checked</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Direct Contact</h3>
              <p className="text-sm opacity-80">Negotiate directly with drivers</p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Safe & Secure</h3>
              <p className="text-sm opacity-80">Your safety is our priority</p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white border-opacity-50 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
