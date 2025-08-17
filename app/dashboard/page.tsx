'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { AuthenticatedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { 
  User, 
  Calendar, 
  MapPin, 
  Car, 
  Star, 
  Phone, 
  MessageSquare,
  Settings,
  LogOut,
  Plus,
  Wifi,
  CreditCard
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const { user, profile, signOutMutation } = useAuth();
  const { bookings, isLoading: bookingsLoading } = useBookings();
  const router = useRouter();
  const { mutate: signOut, isLoading: signOutLoading } = signOutMutation;

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

  const recentBookings = bookings?.slice(0, 5) || [];

  return (
    <AuthenticatedRoute>
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
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {profile?.full_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/profile')}
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
              {/* Quick Actions */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => router.push('/')}
                    className="h-16 text-left justify-start"
                    size="lg"
                  >
                    <Plus className="w-6 h-6 mr-3" />
                    <div>
                      <div className="font-medium">Book a Ride</div>
                      <div className="text-sm opacity-80">Find a driver near you</div>
                    </div>
                  </Button>
                                          <Button
                          variant="outline"
                          onClick={() => router.push('/profile')}
                          className="h-16 text-left justify-start"
                          size="lg"
                        >
                          <User className="w-6 h-6 mr-3" />
                          <div>
                            <div className="font-medium">View Profile</div>
                            <div className="text-sm opacity-80">Manage your account</div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => router.push('/realtime-demo')}
                          className="h-16 text-left justify-start"
                          size="lg"
                        >
                          <Wifi className="w-6 h-6 mr-3" />
                          <div>
                            <div className="font-medium">Real-time Demo</div>
                            <div className="text-sm opacity-80">Experience live features</div>
                          </div>
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => router.push('/payment-demo')}
                          className="h-16 text-left justify-start"
                          size="lg"
                        >
                          <CreditCard className="w-6 h-6 mr-3" />
                          <div>
                            <div className="font-medium">Payment Demo</div>
                            <div className="text-sm opacity-80">Test payment integration</div>
                          </div>
                        </Button>
                </div>
              </motion.div>

              {/* Recent Bookings */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/bookings')}
                  >
                    View All
                  </Button>
                </div>
                
                {bookingsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : recentBookings.length > 0 ? (
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <motion.div
                        key={booking.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Car className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {booking.driver?.car_name || 'Driver Assigned'}
                              </span>
                              {booking.driver?.rating && (
                                <div className="flex items-center space-x-1">
                                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                  <span className="text-sm text-gray-600">
                                    {booking.driver.rating.toFixed(1)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>From: {booking.pickup_location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4" />
                                <span>To: {booking.drop_location}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {new Date(booking.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">
                              ₹{booking.estimated_fare}
                            </div>
                            <div className="text-sm text-gray-500">
                              {booking.status}
                            </div>
                          </div>
                        </div>
                        
                        {booking.driver && (
                          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">
                                Driver: {booking.driver.profile?.full_name}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              {booking.driver.profile?.phone && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`tel:${booking.driver.profile.phone}`)}
                                >
                                  <Phone className="w-4 h-4" />
                                </Button>
                              )}
                              {booking.driver.profile?.whatsapp && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(`https://wa.me/${booking.driver.profile.whatsapp}`)}
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
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                    <p className="text-gray-600 mb-4">Start your journey by booking your first ride</p>
                    <Button onClick={() => router.push('/')}>
                      Book Your First Ride
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
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {profile?.full_name || 'User'}
                  </h3>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Rides</span>
                      <span className="font-semibold">{bookings?.length || 0}</span>
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

              {/* Stats Card */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completed Rides</span>
                    <span className="font-semibold">
                      {bookings?.filter(b => b.status === 'completed').length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Spent</span>
                    <span className="font-semibold">
                      ₹{bookings?.reduce((sum, b) => sum + (b.estimated_fare || 0), 0) || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Average Rating</span>
                    <span className="font-semibold">-</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedRoute>
  );
}
