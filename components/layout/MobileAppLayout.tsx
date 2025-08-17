'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, MapPin, User, Menu, X, ArrowLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useSwipeGesture } from '@/components/hooks/useSwipeGesture';

type AppSection = 'home' | 'booking' | 'profile' | 'menu' | 'user-panel' | 'driver-panel' | 'admin-panel';

interface MobileAppLayoutProps {
  children: React.ReactNode;
  currentSection?: AppSection;
  onSectionChange?: (section: AppSection) => void;
  showBackButton?: boolean;
  onBack?: () => void;
  title?: string;
}

export function MobileAppLayout({
  children,
  currentSection = 'home',
  onSectionChange,
  showBackButton = false,
  onBack,
  title
}: MobileAppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Swipe gesture support
  useSwipeGesture(containerRef, {
    onSwipeRight: () => {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
    },
    onSwipeLeft: () => {
      if (!isMenuOpen && onSectionChange) {
        // Navigate to next section (only for main navigation sections)
        const mainSections: AppSection[] = ['home', 'booking', 'profile', 'menu'];
        if (mainSections.includes(currentSection)) {
          const _currentIndex = mainSections.indexOf(currentSection);
          const nextIndex = (_currentIndex + 1) % mainSections.length;
          const nextSection = mainSections[nextIndex];
          if (nextSection) {
            onSectionChange(nextSection);
          }
        }
      }
    }
  });

  const _navItems = [
    { id: 'home', icon: Home, label: 'Home', color: 'from-blue-500 to-blue-600' },
    { id: 'booking', icon: MapPin, label: 'Book', color: 'from-green-500 to-green-600' },
    { id: 'profile', icon: User, label: 'Profile', color: 'from-purple-500 to-purple-600' },
    { id: 'menu', icon: Menu, label: 'Menu', color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div ref={containerRef} className="mobile-container">
      {/* Enhanced Mobile Header */}
      <motion.header 
        className="mobile-header"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          {showBackButton ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBack}
              className="p-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
          ) : (
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center shadow-lg"
              >
                <span className="text-white font-bold text-lg">G</span>
              </motion.div>
              <div>
                <span className="font-bold text-xl text-gray-900">Goa Taxi</span>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-gray-500">Premium Service</span>
                </div>
              </div>
            </div>
          )}
          
          {title && (
            <h1 className="font-bold text-xl text-gray-900">{title}</h1>
          )}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(true)}
            className="p-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full overflow-y-auto pb-20"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Enhanced Bottom Navigation - Only show for main sections */}
      {['home', 'booking', 'profile', 'menu'].includes(currentSection) && (
        <motion.nav 
          className="mobile-nav"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="flex items-center justify-around">
            {_navItems.map((item: any) => {
              const _Icon = item.icon;
              const isActive = currentSection === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => {
                    if (onSectionChange) {
                      onSectionChange(item.id as any);
                    }
                    if (item.id === 'menu') {
                      setIsMenuOpen(true);
                    }
                  }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-br ${item.color} text-white shadow-lg shadow-primary-500/25` 
                      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className={`w-6 h-6 ${isActive ? 'text-white' : ''}`} />
                  <span className={`text-xs font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 w-1 h-1 bg-white rounded-full"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.nav>
      )}

      {/* Enhanced Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 bg-gradient-to-br from-white to-gray-50 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                      <span className="text-white font-bold text-lg">G</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Menu</h2>
                      <p className="text-sm text-gray-500">Goa Taxi App</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="flex-1 space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="w-full text-left p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-semibold">📋</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">My Bookings</div>
                        <div className="text-sm text-gray-500">View your ride history</div>
                      </div>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="w-full text-left p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-semibold">❤️</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Favorite Drivers</div>
                        <div className="text-sm text-gray-500">Your saved drivers</div>
                      </div>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="w-full text-left p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-semibold">⚙️</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Settings</div>
                        <div className="text-sm text-gray-500">App preferences</div>
                      </div>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="w-full text-left p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-semibold">💬</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Help & Support</div>
                        <div className="text-sm text-gray-500">Get help and contact us</div>
                      </div>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, x: 5 }}
                    className="w-full text-left p-4 rounded-2xl hover:bg-white hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                        <span className="text-white font-semibold">ℹ️</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">About</div>
                        <div className="text-sm text-gray-500">App information</div>
                      </div>
                    </div>
                  </motion.button>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    className="w-full py-4 rounded-2xl border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
                    onClick={() => {
                      // Handle sign out
                      setIsMenuOpen(false);
                    }}
                  >
                    <span className="mr-2">🚪</span>
                    Sign Out
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
