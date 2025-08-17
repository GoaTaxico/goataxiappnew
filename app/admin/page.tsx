'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats, useRecentActivity } from '@/hooks/useAnalytics';
import { usePendingDrivers } from '@/hooks/useDrivers';
import { AdminRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { 
  Shield, 
  Users, 
  Car, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  XCircle,
  Settings,
  LogOut,
  Eye,
  Star,
  MapPin,
  Calendar
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminDashboardPage() {
  const { user, profile, signOutMutation } = useAuth();
  const { stats: dashboardStats, isLoading: dashboardStatsLoading } = useDashboardStats();
  const { drivers: pendingDrivers, isLoading: pendingDriversLoading } = usePendingDrivers();
  const { activity: recentActivity, isLoading: recentActivityLoading } = useRecentActivity();
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

  return (
    <AdminRoute>
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
                <div className="w-12 h-12 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {profile?.full_name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/admin/settings')}
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
              {/* Analytics Overview */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Analytics Overview</h2>
                
                {dashboardStatsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-xl"></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 font-medium">Total Users</p>
                          <p className="text-2xl font-bold text-blue-900">
                            {dashboardStats?.totalUsers || 0}
                          </p>
                        </div>
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 font-medium">Active Drivers</p>
                          <p className="text-2xl font-bold text-green-900">
                            {dashboardStats?.activeDrivers || 0}
                          </p>
                        </div>
                        <Car className="w-8 h-8 text-green-600" />
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 font-medium">Total Bookings</p>
                          <p className="text-2xl font-bold text-purple-900">
                            {dashboardStats?.totalBookings || 0}
                          </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-purple-600" />
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-600 font-medium">Pending Approvals</p>
                          <p className="text-2xl font-bold text-yellow-900">
                            {dashboardStats?.pendingDrivers || 0}
                          </p>
                        </div>
                        <Clock className="w-8 h-8 text-yellow-600" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Pending Driver Approvals */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Pending Driver Approvals</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push('/admin/drivers')}
                  >
                    View All Drivers
                  </Button>
                </div>
                
                {pendingDriversLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : pendingDrivers && pendingDrivers.length > 0 ? (
                  <div className="space-y-4">
                    {pendingDrivers.slice(0, 5).map((driver) => (
                      <motion.div
                        key={driver.id}
                        className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Car className="w-4 h-4 text-gray-500" />
                              <span className="font-medium text-gray-900">
                                {driver.profile?.full_name || 'Driver'}
                              </span>
                              <div className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Pending
                              </div>
                            </div>
                            <div className="space-y-1 text-sm text-gray-600">
                              <div className="flex items-center space-x-2">
                                <span>Vehicle: {driver.car_name} • {driver.car_number}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span>Type: {driver.vehicle_type}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  Applied: {new Date(driver.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              onClick={() => router.push(`/admin/drivers/${driver.id}`)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Review
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No pending approvals</h3>
                    <p className="text-gray-600">All driver applications have been reviewed</p>
                  </div>
                )}
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  {recentActivity?.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button
                    onClick={() => router.push('/admin/drivers')}
                    className="w-full justify-start"
                    size="lg"
                  >
                    <Car className="w-5 h-5 mr-3" />
                    Manage Drivers
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/admin/users')}
                    className="w-full justify-start"
                    size="lg"
                  >
                    <Users className="w-5 h-5 mr-3" />
                    Manage Users
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/admin/analytics')}
                    className="w-full justify-start"
                    size="lg"
                  >
                    <TrendingUp className="w-5 h-5 mr-3" />
                    View Analytics
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push('/admin/settings')}
                    className="w-full justify-start"
                    size="lg"
                  >
                    <Settings className="w-5 h-5 mr-3" />
                    System Settings
                  </Button>
                </div>
              </motion.div>

              {/* System Stats */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Statistics</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Users</span>
                    <span className="font-semibold">{dashboardStats?.totalUsers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Drivers</span>
                    <span className="font-semibold">{dashboardStats?.totalDrivers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Subscriptions</span>
                    <span className="font-semibold">{dashboardStats?.activeSubscriptions || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Today&apos;s Bookings</span>
                    <span className="font-semibold">{dashboardStats?.todayBookings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold">
                      {dashboardStats?.completionRate ? `${dashboardStats.completionRate}%` : 'N/A'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Admin Profile */}
              <motion.div
                className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {profile?.full_name || 'Admin'}
                  </h3>
                  <p className="text-gray-600 mb-4">{user?.email}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Role</span>
                      <span className="font-semibold capitalize">{profile?.role}</span>
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
            </div>
          </div>
        </div>
      </div>
    </AdminRoute>
  );
}
