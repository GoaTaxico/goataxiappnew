'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileAppLayout } from '@/components/layout/MobileAppLayout';
import { MobileHomeScreen } from '@/components/screens/MobileHomeScreen';
import { MobileBookingScreen } from '@/components/screens/MobileBookingScreen';
import { MobileUserPanel } from '@/components/screens/MobileUserPanel';
import { MobileDriverPanel } from '@/components/screens/MobileDriverPanel';
import { MobileAdminPanel } from '@/components/screens/MobileAdminPanel';

type AppSection = 'home' | 'booking' | 'profile' | 'menu' | 'user-panel' | 'driver-panel' | 'admin-panel';

export function MobileApp() {
  const [currentSection, setCurrentSection] = useState<AppSection>('home');
  const [showBookingScreen, setShowBookingScreen] = useState(false);

  const _handleSectionChange = (section: AppSection) => {
    if (section === 'booking') {
      setShowBookingScreen(true);
    } else {
      setCurrentSection(section);
    }
  };

  const handleBackFromBooking = () => {
    setShowBookingScreen(false);
  };

  const _renderContent = () => {
    if (showBookingScreen) {
      return (
        <MobileBookingScreen onBack={handleBackFromBooking} />
      );
    }

    switch (currentSection) {
      case 'home':
        return (
          <MobileHomeScreen 
            onNavigateToBooking={() => setShowBookingScreen(true)}
          />
        );
      
      case 'profile':
        return (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">Choose Your Role</h2>
              <p className="text-gray-600 mb-6">Select which panel you&apos;d like to access</p>
              <div className="space-y-4">
                <button 
                  onClick={() => setCurrentSection('user-panel')}
                  className="w-full p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">U</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">User Panel</div>
                      <div className="text-sm opacity-90">Manage bookings, favorites, and profile</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setCurrentSection('driver-panel')}
                  className="w-full p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">D</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">Driver Panel</div>
                      <div className="text-sm opacity-90">Manage rides, earnings, and subscription</div>
                    </div>
                  </div>
                </button>
                
                <button 
                  onClick={() => setCurrentSection('admin-panel')}
                  className="w-full p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">A</span>
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-lg">Admin Panel</div>
                      <div className="text-sm opacity-90">Manage system, users, and analytics</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        );
      
      case 'user-panel':
        return <MobileUserPanel onBack={() => setCurrentSection('profile')} />;
      case 'driver-panel':
        return <MobileDriverPanel onBack={() => setCurrentSection('profile')} />;
      case 'admin-panel':
        return <MobileAdminPanel onBack={() => setCurrentSection('profile')} />;
      case 'menu':
        return (
          <div className="p-4 space-y-6">
            <div className="bg-white rounded-2xl p-6">
              <h2 className="text-2xl font-bold mb-4">Menu</h2>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="font-medium">About Goa Taxi</div>
                  <div className="text-sm text-gray-500">Learn more about us</div>
                </button>
                
                <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Help & Support</div>
                  <div className="text-sm text-gray-500">Get help and contact us</div>
                </button>
                
                <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Privacy Policy</div>
                  <div className="text-sm text-gray-500">Read our privacy policy</div>
                </button>
                
                <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Terms of Service</div>
                  <div className="text-sm text-gray-500">Read our terms</div>
                </button>
                
                <button className="w-full text-left p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="font-medium">Rate the App</div>
                  <div className="text-sm text-gray-500">Share your feedback</div>
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return <MobileHomeScreen />;
    }
  };

  return (
    <div className="md:hidden">
      <MobileAppLayout
        currentSection={currentSection}
        onSectionChange={_handleSectionChange}
        showBackButton={showBookingScreen}
        onBack={handleBackFromBooking}
        title={showBookingScreen ? 'Book a Ride' : ''}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={showBookingScreen ? 'booking' : currentSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {_renderContent()}
          </motion.div>
        </AnimatePresence>
      </MobileAppLayout>
    </div>
  );
}
