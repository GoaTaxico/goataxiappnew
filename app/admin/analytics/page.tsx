'use client';

import { useState } from 'react';
import { unstable_noStore as noStore } from 'next/cache';

// Force dynamic rendering
noStore();
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats, useRecentActivity } from '@/hooks/useAnalytics';
import { AdminRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { 
  TrendingUp, 
  Users, 
  Car, 
  DollarSign, 
  Clock, 
  CheckCircle,
  XCircle,
  ArrowLeft,
  Download,
  RefreshCw,
  Shield,
  Settings,
  LogOut,
  BarChart3,
  Activity,
  Calendar,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Eye,
  Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export default function AdminAnalyticsPage() {
  const { user, profile, signOutMutation } = useAuth();
  const router = useRouter();
  const { mutate: signOut, isLoading: signOutLoading } = signOutMutation;
  
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [activeTab, setActiveTab] = useState<'overview' | 'revenue' | 'rides' | 'drivers'>('overview');

  const { stats: dashboardStats, isLoading: dashboardStatsLoading } = useDashboardStats();
  const { activity: recentActivity, isLoading: recentActivityLoading } = useRecentActivity();

  // Fetch additional analytics data
  const { data: revenueData = [], isLoading: revenueLoading } = useQuery({
    queryKey: ['admin-revenue', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payments')
        .select('amount, created_at, status')
        .eq('status', 'completed')
        .gte('created_at', getDateFromRange(timeRange))
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });

  const { data: ridesData = [], isLoading: ridesLoading } = useQuery({
    queryKey: ['admin-rides', timeRange],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('status, created_at, pickup_location, dropoff_location')
        .gte('created_at', getDateFromRange(timeRange))
        .order('created_at', { ascending: true });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });

  const { data: driverStats = [], isLoading: driverStatsLoading } = useQuery({
    queryKey: ['admin-driver-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('drivers')
        .select(`
          id,
          status,
          is_online,
          rating,
          created_at,
          profiles (
            full_name,
            email
          ),
          bookings (
            id,
            status
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });

  const _handleSignOut = () => {
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

  const getDateFromRange = (range: string) => {
    const now = new Date();
    switch (range) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString();
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000).toISOString();
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    }
  };

  const _calculateRevenueStats = () => {
    const totalRevenue = revenueData.reduce((sum, payment) => sum + payment.amount, 0);
    const avgRevenue = revenueData.length > 0 ? totalRevenue / revenueData.length : 0;
    const completedPayments = revenueData.length;
    
    return { totalRevenue, avgRevenue, completedPayments };
  };

  const _calculateRideStats = () => {
    const totalRides = ridesData.length;
    const completedRides = ridesData.filter(ride => ride.status === 'completed').length;
    const cancelledRides = ridesData.filter(ride => ride.status === 'cancelled').length;
    const completionRate = totalRides > 0 ? (completedRides / totalRides) * 100 : 0;
    
    return { totalRides, completedRides, cancelledRides, completionRate };
  };

  const _calculateDriverStats = () => {
    const totalDrivers = driverStats.length;
    const activeDrivers = driverStats.filter(driver => driver.status === 'approved').length;
    const onlineDrivers = driverStats.filter(driver => driver.is_online).length;
    const avgRating = driverStats.length > 0 
      ? driverStats.reduce((sum, driver) => sum + (driver.rating || 0), 0) / driverStats.length 
      : 0;
    
    return { totalDrivers, activeDrivers, onlineDrivers, avgRating };
  };

  const revenueStats = _calculateRevenueStats();
  const rideStats = _calculateRideStats();
  const driverStatsData = _calculateDriverStats();

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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'rides', label: 'Rides', icon: Car },
    { id: 'drivers', label: 'Drivers', icon: Users },
  ];

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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                  <p className="text-gray-600">Platform performance insights</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/admin')}
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Dashboard
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
          {/* Time Range Selector */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">Time Range</h2>
                <div className="flex space-x-2">
                  {[
                    { value: '7d', label: '7 Days' },
                    { value: '30d', label: '30 Days' },
                    { value: '90d', label: '90 Days' },
                    { value: '1y', label: '1 Year' },
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setTimeRange(range.value as any)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        timeRange === range.value
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Tab Navigation */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex space-x-1">
              {tabs.map((tab) => {
                const _Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-green-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <_Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-8"
                >
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <span className="text-2xl font-bold text-blue-600">
                          {dashboardStats?.totalUsers || 0}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Users</h3>
                      <p className="text-sm text-gray-600">Platform users</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Car className="w-6 h-6 text-green-600" />
                        </div>
                        <span className="text-2xl font-bold text-green-600">
                          {dashboardStats?.activeDrivers || 0}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Drivers</h3>
                      <p className="text-sm text-gray-600">Online drivers</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                        <span className="text-2xl font-bold text-purple-600">
                          {dashboardStats?.totalBookings || 0}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Bookings</h3>
                      <p className="text-sm text-gray-600">All time bookings</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-yellow-600" />
                        </div>
                        <span className="text-2xl font-bold text-yellow-600">
                          ₹{revenueStats.totalRevenue.toFixed(0)}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">Total Revenue</h3>
                      <p className="text-sm text-gray-600">Last {timeRange}</p>
                    </div>
                  </div>

                  {/* Revenue Chart */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Revenue chart will be implemented</p>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivityLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                          ))}
                        </div>
                      ) : recentActivity && recentActivity.length > 0 ? (
                        recentActivity.slice(0, 5).map((activity, index) => (
                          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">{activity.description}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(activity.timestamp).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8">
                          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No recent activity</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'revenue' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-8"
                >
                  {/* Revenue Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Revenue</h3>
                      <p className="text-3xl font-bold text-green-600">₹{revenueStats.totalRevenue.toFixed(0)}</p>
                      <p className="text-sm text-gray-600">Last {timeRange}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Payment</h3>
                      <p className="text-3xl font-bold text-blue-600">₹{revenueStats.avgRevenue.toFixed(0)}</p>
                      <p className="text-sm text-gray-600">Per transaction</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Transactions</h3>
                      <p className="text-3xl font-bold text-purple-600">{revenueStats.completedPayments}</p>
                      <p className="text-sm text-gray-600">Completed payments</p>
                    </div>
                  </div>

                  {/* Revenue Chart */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Over Time</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Revenue chart will be implemented</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'rides' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-8"
                >
                  {/* Ride Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Rides</h3>
                      <p className="text-3xl font-bold text-blue-600">{rideStats.totalRides}</p>
                      <p className="text-sm text-gray-600">Last {timeRange}</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Completed</h3>
                      <p className="text-3xl font-bold text-green-600">{rideStats.completedRides}</p>
                      <p className="text-sm text-gray-600">Successful rides</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Cancelled</h3>
                      <p className="text-3xl font-bold text-red-600">{rideStats.cancelledRides}</p>
                      <p className="text-sm text-gray-600">Cancelled rides</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Success Rate</h3>
                      <p className="text-3xl font-bold text-purple-600">{rideStats.completionRate.toFixed(1)}%</p>
                      <p className="text-sm text-gray-600">Completion rate</p>
                    </div>
                  </div>

                  {/* Rides Chart */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rides Over Time</h3>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <Car className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Rides chart will be implemented</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'drivers' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-8"
                >
                  {/* Driver Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Drivers</h3>
                      <p className="text-3xl font-bold text-blue-600">{driverStatsData.totalDrivers}</p>
                      <p className="text-sm text-gray-600">All drivers</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Drivers</h3>
                      <p className="text-3xl font-bold text-green-600">{driverStatsData.activeDrivers}</p>
                      <p className="text-sm text-gray-600">Approved drivers</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Online Now</h3>
                      <p className="text-3xl font-bold text-purple-600">{driverStatsData.onlineDrivers}</p>
                      <p className="text-sm text-gray-600">Currently online</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Avg Rating</h3>
                      <p className="text-3xl font-bold text-yellow-600">{driverStatsData.avgRating.toFixed(1)}</p>
                      <p className="text-sm text-gray-600">Driver ratings</p>
                    </div>
                  </div>

                  {/* Top Drivers */}
                  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Drivers</h3>
                    <div className="space-y-4">
                      {driverStatsLoading ? (
                        <div className="space-y-3">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-12 bg-gray-200 rounded-lg"></div>
                            </div>
                          ))}
                        </div>
                      ) : driverStats.length > 0 ? (
                        driverStats
                          .filter(driver => driver.status === 'approved')
                          .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                          .slice(0, 5)
                          .map((driver, index) => (
                            <div key={driver.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{index + 1}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-gray-900">
                                  {(driver.profiles as any)?.[0]?.full_name || 'Driver'}
                                </h4>
                                <p className="text-sm text-gray-600">
                                  {driver.bookings?.length || 0} rides • {driver.rating ? `${driver.rating}/5` : 'No rating'}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="font-bold text-gray-900">
                                  {driver.rating ? `${driver.rating}/5` : 'N/A'}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {driver.is_online ? 'Online' : 'Offline'}
                                </div>
                              </div>
                            </div>
                          ))
                      ) : (
                        <div className="text-center py-8">
                          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-500">No drivers found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Quick Stats */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Users</span>
                    <span className="font-semibold">{dashboardStats?.totalUsers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Active Drivers</span>
                    <span className="font-semibold">{dashboardStats?.activeDrivers || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Bookings</span>
                    <span className="font-semibold">{dashboardStats?.totalBookings || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Today&apos;s Revenue</span>
                    <span className="font-semibold">₹{revenueStats?.totalRevenue || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Completion Rate</span>
                    <span className="font-semibold">
                      {dashboardStats?.completionRate ? `${dashboardStats.completionRate}%` : 'N/A'}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* System Health */}
              <motion.div
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Database</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Healthy</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">API</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Online</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payments</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Active</span>
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
