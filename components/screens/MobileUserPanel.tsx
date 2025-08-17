'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Clock, 
  MapPin, 
  Star, 
  Heart, 
  Settings, 
  LogOut, 
  Phone, 
  MessageCircle,
  Edit,
  Shield,
  CreditCard,
  HelpCircle,
  Bell,
  Calendar,
  Car,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { useFavorites, useFavoriteActions } from '@/hooks/useFavorites';

interface MobileUserPanelProps {
  onBack?: () => void;
}

export function MobileUserPanel({ onBack }: MobileUserPanelProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'bookings' | 'favorites' | 'settings'>('profile');
  
  const { user, profile, signOut } = useAuth();
  const { bookings, isLoading: bookingsLoading } = useBookings(user?.id);
  const { favorites, isLoading: favoritesLoading } = useFavorites(user?.id);
  const { addToFavorites, removeFromFavorites, addLoading, removeLoading } = useFavoriteActions();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'upcoming':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'upcoming':
        return <Clock className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const renderProfileTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-bold text-2xl">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{profile?.full_name || 'User'}</h2>
            <p className="text-sm opacity-90">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Star className="w-4 h-4 text-yellow-300 fill-current" />
              <span className="text-sm font-medium">4.8</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold">{bookings?.length || 0}</div>
            <div className="text-sm opacity-90">Total Rides</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold">
              {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
            </div>
            <div className="text-sm opacity-90">Member Since</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
            <Edit className="w-6 h-6 text-blue-600" />
          </div>
          <div className="font-semibold text-gray-900">Edit Profile</div>
          <div className="text-sm text-gray-600">Update your info</div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <div className="font-semibold text-gray-900">Safety</div>
          <div className="text-sm text-gray-600">Emergency contacts</div>
        </motion.button>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Contact Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Phone className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Phone</div>
              <div className="text-sm text-gray-600">{profile?.phone || 'Not provided'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Email</div>
              <div className="text-sm text-gray-600">{user?.email}</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderBookingsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Booking History</h2>
        <Button variant="ghost" size="sm" className="text-primary-600">
          View All
        </Button>
      </div>

      {bookingsLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      ) : bookings && bookings.length > 0 ? (
        bookings.slice(0, 5).map((booking, index) => (
          <motion.div
            key={booking.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {booking.driver?.profile?.full_name || 'Driver'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {booking.driver?.car_name || 'Vehicle'}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)}
                {booking.status}
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">From: {booking.pickup_location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">To: {booking.drop_location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">
                  {new Date(booking.created_at).toLocaleDateString()} at {new Date(booking.created_at).toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="font-bold text-lg text-gray-900">₹{booking.estimated_fare || 0}</div>
              {booking.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{booking.rating}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No bookings found.</p>
        </div>
      )}
    </motion.div>
  );

  const renderFavoritesTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Favorite Drivers</h2>
        <Button variant="ghost" size="sm" className="text-primary-600">
          Add New
        </Button>
      </div>

      {favoritesLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded-2xl"></div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-8">
          <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No favorite drivers yet</p>
          <p className="text-sm text-gray-400 mt-2">Add drivers to your favorites for quick access</p>
        </div>
      ) : (
        favorites.map((favorite: any, index: number) => {
          const driver = favorite.driver;
          if (!driver) return null;
          
          return (
            <motion.div
              key={favorite.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {driver.profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'D'}
                    </span>
                  </div>
                  {driver.is_online && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{driver.profile?.full_name || 'Driver'}</h3>
                    <Heart className="w-4 h-4 text-red-500 fill-current" />
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{driver.car_name} • {driver.car_number}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium">{driver.rating ? `${driver.rating}/5` : 'No rating'}</span>
                    </div>
                    <span className="text-sm text-gray-500">• {driver.total_rides || 0} rides</span>
                    <span className="text-sm text-gray-500">• {driver.vehicle_type}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-green-500 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                  onClick={() => window.open(`tel:${driver.profile?.phone}`)}
                  disabled={!driver.profile?.phone}
                >
                  <Phone className="w-4 h-4" />
                  Call
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                  onClick={() => window.open(`https://wa.me/${driver.profile?.whatsapp?.replace(/\s/g, '')}`)}
                  disabled={!driver.profile?.whatsapp}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-red-500 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                  onClick={() => {
                    if (user?.id && driver.id) {
                      removeFromFavorites({ userId: user.id, driverId: driver.id });
                    }
                  }}
                  disabled={removeLoading}
                >
                  <X className="w-4 h-4" />
                  Remove
                </motion.button>
              </div>
            </motion.div>
          );
        })
      )}
    </motion.div>
  );

  const renderSettingsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold">App Settings</h3>
        </div>
        
        <div className="space-y-1">
          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Notifications</div>
              <div className="text-sm text-gray-600">Manage push notifications</div>
            </div>
          </button>

          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Privacy & Security</div>
              <div className="text-sm text-gray-600">Manage your privacy settings</div>
            </div>
          </button>

          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Payment Methods</div>
              <div className="text-sm text-gray-600">Manage payment options</div>
            </div>
          </button>

          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Help & Support</div>
              <div className="text-sm text-gray-600">Get help and contact us</div>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold">Account</h3>
        </div>
        
        <div className="space-y-1">
          <button 
            className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors"
            onClick={() => signOut()}
          >
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-red-600">Sign Out</div>
              <div className="text-sm text-gray-600">Log out of your account</div>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white/95 backdrop-blur-lg border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex items-center justify-between">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <User className="w-5 h-5" />
          </motion.button>
          
          <h1 className="font-bold text-xl text-gray-900">User Panel</h1>
          
          <div className="w-12"></div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between mt-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-br from-primary-500 to-secondary-500 text-white shadow-lg' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-white' : ''}`}>{tab.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'bookings' && renderBookingsTab()}
          {activeTab === 'favorites' && renderFavoritesTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </AnimatePresence>
      </div>
    </div>
  );
}
