'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useDriverBookings } from '@/hooks/useBookings';
import { useDriverActions } from '@/hooks/useDrivers';
import { SubscriptionManager } from '@/components/payments/SubscriptionManager';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { DriverRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
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
  const totalEarnings = completedRides.reduce((sum, ride) => sum + (ride.estimated_fare || 0), 0);

  return (
    <DriverRoute>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Driver Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {profile?.full_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant={driver?.is_online ? "primary" : "outline"}
                  size="sm"
                  onClick={handleToggleStatus}
                  disabled={statusUpdating}
                  className={driver?.is_online ? "bg-green-600 hover:bg-green-700" : ""}
                >
                  {driver?.is_online ? (
                    <>
                      <Wifi className="w-4 h-4 mr-2" />
                      Online
                    </>
                  ) : (
                    <>
                      <WifiOff className="w-4 h-4 mr-2" />
                      Offline
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/driver/profile')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Status Card */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Current Status</h2>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    driver?.is_online 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {driver?.is_online ? 'Available for rides' : 'Currently offline'}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">{rides?.length || 0}</div>
                    <div className="text-sm text-gray-600">Total Rides</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">{completedRides.length}</div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">₹{totalEarnings}</div>
                    <div className="text-sm text-gray-600">Total Earnings</div>
                  </div>
                </div>
              </motion.div>

              {/* Recent Rides */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Rides</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/driver/rides')}
                  >
                    View All
                  </Button>
                </div>
                
                {ridesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : recentRides.length > 0 ? (
                  <div className="space-y-4">
                    {recentRides.map((ride) => (
                      <motion.div
                        key={ride.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {ride.user?.full_name || 'Passenger'}
                              </span>
                              <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                                ride.status === 'completed' 
                                  ? 'bg-green-100 text-green-800'
                                  : ride.status === 'in_progress'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {ride.status.replace('_', ' ')}
                              </div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>From: {ride.pickup_location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>To: {ride.drop_location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(ride.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              ₹{ride.estimated_fare}
                            </div>
                            <div className="text-sm text-gray-500">
                              {ride.passenger_count} passenger{ride.passenger_count !== 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                        
                        {ride.user && (
                          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">
                                Passenger: {ride.user.full_name}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              {ride.user.phone && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`tel:${ride.user.phone}`)}
                                >
                                  <Phone className="w-4 h-4" />
                                </Button>
                              )}
                              {ride.user.whatsapp && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`https://wa.me/${ride.user.whatsapp}`)}
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No rides yet</h3>
                    <p className="text-gray-600 mb-4">Go online to start receiving ride requests</p>
                    <Button 
                      onClick={handleToggleStatus}
                      disabled={statusUpdating}
                      className={driver?.is_online ? "bg-green-600 hover:bg-green-700" : ""}
                    >
                      {driver?.is_online ? 'Go Offline' : 'Go Online'}
                    </Button>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Profile Card */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Car className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {profile?.full_name || 'Driver'}
                  </h3>
                  <p className="text-gray-600 mb-2">{user?.email}</p>
                  <p className="text-sm text-gray-500 mb-4">{driver?.car_name} • {driver?.car_number}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Rating</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="font-semibold">{driver?.rating?.toFixed(1) || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Rides</span>
                      <span className="font-semibold">{rides?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-semibold">
                        {profile?.created_at 
                          ? new Date(profile.created_at).toLocaleDateString()
                          : 'N/A'
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Vehicle Info */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Vehicle</span>
                    <span className="font-semibold">{driver?.car_name || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Number</span>
                    <span className="font-semibold">{driver?.car_number || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Color</span>
                    <span className="font-semibold">{driver?.car_color || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Year</span>
                    <span className="font-semibold">{driver?.car_model_year || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Type</span>
                    <span className="font-semibold capitalize">{driver?.vehicle_type || 'N/A'}</span>
                  </div>
                </div>
              </motion.div>

              {/* Subscription Manager */}
              <SubscriptionManager />
            </div>
          </div>

          {/* Payment History Section */}
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <PaymentHistory />
          </motion.div>
        </div>
      </div>
    </DriverRoute>
  );
}
