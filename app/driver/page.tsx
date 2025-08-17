'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useDriverBookings } from '@/hooks/useBookings';
import { useDriverActions } from '@/hooks/useDrivers';
import { SubscriptionManager } from '@/components/payments/SubscriptionManager';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { DriverRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { ClientOnly } from '@/components/ui/ClientOnly';
import { 
  Car, 
  Calendar, 
  MapPin, 
  User, 
  Star, 
  Phone, 
  MessageSquare,
  Settings,
  LogOut,
  Wifi,
  WifiOff,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DriverDashboardPage() {
  return (
    <DriverRoute>
      <ClientOnly>
        <DriverDashboardContent />
      </ClientOnly>
    </DriverRoute>
  );
}

function DriverDashboardContent() {
  const { user, profile, driver, signOutMutation } = useAuth();
  const { bookings: rides, isLoading: ridesLoading } = useDriverBookings();
  const { updateDriverStatus: updateStatus } = useDriverActions();
  const router = useRouter();
  const { mutate: signOut, isLoading: signOutLoading } = signOutMutation;
  const { updateDriverStatus, updateStatusLoading: statusUpdating } = useDriverActions();

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        toast.success('Successfully signed out');
        router.push('/');
      },
      onError: () => {
        toast.error('Failed to sign out');
      },
    });
  };

  const handleToggleStatus = () => {
    if (!driver) return;
    
    updateDriverStatus(
      { driverId: driver.id, isOnline: !driver.is_online },
      {
        onSuccess: () => {
          toast.success(driver.is_online ? 'You are now offline' : 'You are now online');
        },
        onError: () => {
          toast.error('Failed to update status');
        },
      }
    );
  };

  const recentRides = rides?.slice(0, 5) || [];
  const completedRides = rides?.filter(ride => ride.status === 'completed') || [];
  const totalEarnings = completedRides.reduce((sum, ride) => sum + (ride.fare || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <motion.div
        className="bg-white shadow-sm border-b border-gray-200"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
                <p className="text-gray-600">Welcome back, {profile?.full_name || 'Driver'}!</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
                             <Button
                 onClick={handleToggleStatus}
                 disabled={statusUpdating || !driver}
                 variant={driver?.is_online ? "outline" : "primary"}
                 className={driver?.is_online ? "bg-red-50 text-red-700 border-red-200 hover:bg-red-100" : ""}
               >
                {driver?.is_online ? (
                  <>
                    <WifiOff className="w-4 h-4 mr-2" />
                    Go Offline
                  </>
                ) : (
                  <>
                    <Wifi className="w-4 h-4 mr-2" />
                    Go Online
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/realtime-demo')}
              >
                <Wifi className="w-4 h-4 mr-2" />
                Real-time Demo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                disabled={signOutLoading}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Rides</p>
                <p className="text-2xl font-bold text-gray-900">{rides?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Car className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Rides</p>
                <p className="text-2xl font-bold text-gray-900">{completedRides.length}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{totalEarnings.toFixed(0)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Status</p>
                <p className="text-2xl font-bold text-gray-900">
                  {driver?.is_online ? 'Online' : 'Offline'}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                driver?.is_online ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {driver?.is_online ? (
                  <Wifi className="w-6 h-6 text-green-600" />
                ) : (
                  <WifiOff className="w-6 h-6 text-gray-600" />
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Rides */}
        <motion.div
          className="bg-white rounded-xl shadow-lg border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Rides</h2>
          </div>
          <div className="p-6">
            {ridesLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading rides...</p>
              </div>
            ) : recentRides.length > 0 ? (
              <div className="space-y-4">
                {recentRides.map((ride) => (
                  <div key={ride.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {ride.pickup_location} → {ride.destination}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(ride.created_at).toLocaleDateString()} • ₹{ride.fare}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        ride.status === 'completed' ? 'bg-green-100 text-green-800' :
                        ride.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        ride.status === 'confirmed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {ride.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No rides yet</h3>
                <p className="text-gray-600 mb-4">Go online to start receiving ride requests</p>
                <Button onClick={handleToggleStatus} disabled={!driver}>
                  Go Online
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Button
            onClick={handleToggleStatus}
            disabled={statusUpdating || !driver}
            className="h-32 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
          >
            {driver?.is_online ? (
              <>
                <WifiOff className="w-8 h-8" />
                <span className="font-medium">Go Offline</span>
              </>
            ) : (
              <>
                <Wifi className="w-8 h-8" />
                <span className="font-medium">Go Online</span>
              </>
            )}
          </Button>

          <Button
            onClick={() => router.push('/realtime-demo')}
            className="h-32 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
          >
            <Wifi className="w-8 h-8" />
            <span className="font-medium">Real-time Features</span>
          </Button>

          <Button
            onClick={() => router.push('/driver/profile')}
            className="h-32 flex flex-col items-center justify-center space-y-2 bg-gradient-to-r from-orange-600 to-red-600 text-white hover:from-orange-700 hover:to-red-700"
          >
            <Settings className="w-8 h-8" />
            <span className="font-medium">Profile Settings</span>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
