'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Car, 
  Clock, 
  MapPin, 
  Star, 
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
  CheckCircle,
  XCircle,
  AlertCircle,
  Wifi,
  WifiOff,
  Crown,
  Zap,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useDriverBookings } from '@/hooks/useBookings';
import { useDriverActions } from '@/hooks/useDrivers';
import { SubscriptionManager } from '@/components/payments/SubscriptionManager';
import { useSubscriptions } from '@/hooks/usePayments';

interface MobileDriverPanelProps {
  onBack?: () => void;
}

export function MobileDriverPanel({ onBack }: MobileDriverPanelProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'rides' | 'subscription' | 'settings'>('profile');
  
  const { user, profile, driver, signOut } = useAuth();
  const { bookings: rides, isLoading: ridesLoading } = useDriverBookings(driver?.id);
  const { updateDriverStatus, updateStatusLoading } = useDriverActions();
  const { data: subscriptions, isLoading: subscriptionsLoading } = useSubscriptions();

  const handleOnlineStatusToggle = () => {
    if (driver?.id) {
      updateDriverStatus({ driverId: driver.id, isOnline: !driver.is_online });
    }
  };

  // Get current subscription
  const currentSubscription = subscriptions?.[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'upcoming':
        return 'text-blue-600 bg-blue-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
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
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
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
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'D'}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-2xl font-bold">{profile?.full_name || 'Driver'}</h2>
                <Crown className="w-5 h-5 text-yellow-300" />
              </div>
              <p className="text-sm opacity-90">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Star className="w-4 h-4 text-yellow-300 fill-current" />
                <span className="text-sm font-medium">{driver?.rating || 0}</span>
                <span className="text-sm opacity-90">• {rides?.length || 0} rides</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm text-center">
              <div className="text-2xl font-bold">{rides?.length || 0}</div>
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

      {/* Online Status */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full ${driver?.is_online ? 'bg-green-500' : 'bg-red-500'}`} />
            <div>
              <div className="font-semibold text-gray-900">
                {driver?.is_online ? 'Online' : 'Offline'}
              </div>
              <div className="text-sm text-gray-600">
                {driver?.is_online ? 'Ready to accept rides' : 'Not accepting rides'}
              </div>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOnlineStatusToggle}
            disabled={updateStatusLoading}
            className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
              driver?.is_online 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {updateStatusLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              driver?.is_online ? 'Go Offline' : 'Go Online'
            )}
          </motion.button>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Vehicle Information</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Car className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{driver?.car_name || 'Vehicle'}</div>
              <div className="text-sm text-gray-600">{driver?.car_number || 'Not provided'}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">License</div>
              <div className="text-sm text-gray-600">{driver?.license_number || 'Not provided'}</div>
            </div>
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
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
            <Car className="w-6 h-6 text-purple-600" />
          </div>
          <div className="font-semibold text-gray-900">Vehicle</div>
          <div className="text-sm text-gray-600">Update vehicle details</div>
        </motion.button>
      </div>
    </motion.div>
  );

  const renderRidesTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Ride History</h2>
        <Button variant="ghost" size="sm" className="text-primary-600">
          View All
        </Button>
      </div>

      {ridesLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
        </div>
      ) : rides && rides.length > 0 ? (
        rides.slice(0, 5).map((ride, index) => (
          <motion.div
            key={ride.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {ride.user?.full_name || 'Passenger'}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(ride.created_at).toLocaleDateString()} at {new Date(ride.created_at).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(ride.status)}`}>
                {getStatusIcon(ride.status)}
                {ride.status}
              </div>
            </div>

            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">From: {ride.pickup_location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">To: {ride.drop_location}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="font-bold text-lg text-gray-900">₹{ride.estimated_fare || 0}</div>
              {ride.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium">{ride.rating}</span>
                </div>
              )}
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No rides found.</p>
        </div>
      )}
    </motion.div>
  );

  

  const renderSubscriptionTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <SubscriptionManager />
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
              <div className="text-sm text-gray-600">Manage ride alerts</div>
            </div>
          </button>

          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Safety</div>
              <div className="text-sm text-gray-600">Emergency contacts</div>
            </div>
          </button>

          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Payment</div>
              <div className="text-sm text-gray-600">Manage earnings</div>
            </div>
          </button>

          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Help & Support</div>
              <div className="text-sm text-gray-600">Get assistance</div>
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
    { id: 'rides', label: 'Rides', icon: Car },
    { id: 'subscription', label: 'Subscription', icon: Crown },
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
          
          <h1 className="font-bold text-xl text-gray-900">Driver Panel</h1>
          
          <div className="w-12"></div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center justify-between mt-4 overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-300 flex-shrink-0 ${
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
          {activeTab === 'rides' && renderRidesTab()}
          {activeTab === 'subscription' && renderSubscriptionTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </AnimatePresence>
      </div>
    </div>
  );
}
