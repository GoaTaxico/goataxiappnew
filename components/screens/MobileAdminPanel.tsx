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
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Users,
  BarChart3,
  Activity,
  Crown,
  Zap,
  Target,
  Award,
  Filter,
  Search,
  MoreVertical,
  Eye,
  Ban,
  Check,
  X,
  Plus,
  Download,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats, useRecentActivity } from '@/hooks/useAnalytics';
import { useDrivers, usePendingDrivers, useDriverActions } from '@/hooks/useDrivers';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

interface MobileAdminPanelProps {
  onBack?: () => void;
}

export function MobileAdminPanel({ onBack }: MobileAdminPanelProps) {
  const { user, profile, signOutMutation } = useAuth();
  const { mutate: signOut, isLoading: signOutLoading } = signOutMutation;
  const [activeTab, setActiveTab] = useState<'dashboard' | 'drivers' | 'users' | 'analytics' | 'settings'>('dashboard');

  // Fetch real data using hooks
  const { stats: dashboardStats, isLoading: dashboardStatsLoading } = useDashboardStats();
  const { activity: recentActivity, isLoading: recentActivityLoading } = useRecentActivity();
  const { drivers: allDrivers, isLoading: allDriversLoading } = useDrivers();
  const { drivers: pendingDrivers, isLoading: pendingDriversLoading } = usePendingDrivers();
  
  // Driver actions
  const { 
    approveDriver, 
    rejectDriver, 
    approveLoading, 
    rejectLoading 
  } = useDriverActions();

  // Fetch all users
  const { data: allUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          *,
          drivers (
            id,
            car_name,
            car_number,
            status,
            is_online,
            rating,
            created_at
          ),
          bookings (
            id,
            status,
            created_at
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
  });

  // Fetch analytics data
  const { data: analyticsData, isLoading: analyticsLoading } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      // Get revenue data for last 3 months
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const revenueChart = [];
      const ridesChart = [];

      for (let i = 2; i >= 0; i--) {
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        // Get bookings for this month
        const { count: rides } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString());

        // Get payments for this month
        const { data: payments } = await supabase
          .from('payments')
          .select('amount')
          .gte('created_at', monthStart.toISOString())
          .lte('created_at', monthEnd.toISOString())
          .eq('status', 'success');

        const revenue = payments?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

        revenueChart.push({
          month: months[date.getMonth()],
          revenue: Math.round(revenue)
        });

        ridesChart.push({
          month: months[date.getMonth()],
          rides: rides || 0
        });
      }

      // Get top drivers
      const { data: topDrivers } = await supabase
        .from('drivers')
        .select(`
          *,
          profile:profiles(full_name),
          bookings!bookings_driver_id_fkey(
            id,
            status
          )
        `)
        .eq('status', 'approved')
        .order('rating', { ascending: false })
        .limit(5);

      const topDriversData = topDrivers?.map(driver => ({
        name: driver.profile?.full_name || 'Driver',
        rides: driver.bookings?.length || 0,
        earnings: 0 // Earnings removed per requirements
      })) || [];

      return {
        revenueChart,
        ridesChart,
        topDrivers: topDriversData
      };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        toast.success('Successfully signed out');
        // Handle navigation back to main app
      },
      onError: () => {
        toast.error('Failed to sign out');
      },
    });
  };

  const handleApproveDriver = (driverId: string) => {
    approveDriver(driverId, {
      onSuccess: () => {
        toast.success('Driver approved successfully');
      },
      onError: (error) => {
        toast.error('Failed to approve driver');
        console.error('Error approving driver:', error);
      },
    });
  };

  const handleRejectDriver = (driverId: string) => {
    rejectDriver({ driverId, reason: 'Admin rejection' }, {
      onSuccess: () => {
        toast.success('Driver rejected successfully');
      },
      onError: (error) => {
        toast.error('Failed to reject driver');
        console.error('Error rejecting driver:', error);
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'rejected':
        return 'text-red-600 bg-red-100';
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'inactive':
        return 'text-gray-600 bg-gray-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'rejected':
        return <XCircle className="w-4 h-4" />;
      case 'active':
        return <CheckCircle className="w-4 h-4" />;
      case 'inactive':
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const renderDashboardTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Overview */}
      <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Dashboard Overview</h2>
            <p className="text-sm opacity-90">System statistics</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold">{dashboardStatsLoading ? '...' : dashboardStats.totalUsers}</div>
            <div className="text-sm opacity-90">Total Users</div>
          </div>
          <div className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm text-center">
            <div className="text-2xl font-bold">{dashboardStatsLoading ? '...' : dashboardStats.totalDrivers}</div>
            <div className="text-sm opacity-90">Total Drivers</div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{dashboardStatsLoading ? '...' : dashboardStats.todayBookings}</div>
              <div className="text-sm text-gray-600">Today&apos;s Rides</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900">{dashboardStatsLoading ? '...' : dashboardStats.activeSubscriptions}</div>
              <div className="text-sm text-gray-600">Active Subscriptions</div>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Pending Approvals</h3>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
            {dashboardStatsLoading ? '...' : dashboardStats.pendingDrivers}
          </span>
        </div>
        
        <div className="space-y-3">
          {pendingDriversLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : pendingDrivers && pendingDrivers.length > 0 ? (
            pendingDrivers.slice(0, 2).map((driver, index) => (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
              >
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <span className="text-primary-600 font-bold text-sm">
                    {driver.profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'D'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{driver.profile?.full_name || 'Driver'}</div>
                  <div className="text-sm text-gray-600">{driver.car_name} • {driver.car_number}</div>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-green-100 rounded-lg"
                    onClick={() => handleApproveDriver(driver.id)}
                    disabled={approveLoading}
                  >
                    <Check className="w-4 h-4 text-green-600" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-red-100 rounded-lg"
                    onClick={() => handleRejectDriver(driver.id)}
                    disabled={rejectLoading}
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </motion.button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-4">
              <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No pending approvals</p>
            </div>
          )}
        </div>
        
        <Button variant="outline" className="w-full mt-4">
          View All Pending
        </Button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {recentActivityLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-12 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : recentActivity && recentActivity.length > 0 ? (
            recentActivity.slice(0, 3).map((activity, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-gray-900">
                    {activity.user?.full_name || 'User'} booked a ride
                  </div>
                  <div className="text-xs text-gray-600">{activity.status}</div>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(activity.created_at).toLocaleTimeString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No recent activity</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

  const renderDriversTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Search and Filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search drivers..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:border-primary-500 transition-all duration-200"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Drivers List */}
      <div className="space-y-3">
        {allDriversLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : allDrivers.length === 0 ? (
          <div className="text-center py-8">
            <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No drivers found</p>
          </div>
        ) : (
          allDrivers.map((driver, index) => (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
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
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(driver.status)}`}>
                      {getStatusIcon(driver.status)}
                      {driver.status}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{driver.car_name} • {driver.car_number}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{driver.rating ? `${driver.rating}/5` : 'No rating'}</span>
                    </div>
                    <span className="text-gray-500">• {driver.vehicle_type}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                  onClick={() => window.open(`tel:${driver.profile?.phone}`)}
                >
                  <Phone className="w-4 h-4" />
                  Call
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                  onClick={() => window.open(`https://wa.me/${driver.profile?.phone?.replace(/\s/g, '')}`)}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );

  const renderUsersTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Search and Filter */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:border-primary-500 transition-all duration-200"
          />
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-3 bg-gray-100 rounded-2xl hover:bg-gray-200 transition-colors"
        >
          <Filter className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {usersLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-24 bg-gray-200 rounded-2xl"></div>
              </div>
            ))}
          </div>
        ) : allUsers.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          allUsers.map((user, index) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user.full_name?.split(' ').map((n: string) => n[0]).join('') || 'U'}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{user.full_name || 'User'}</h3>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(user.is_active ? 'active' : 'inactive')}`}>
                      {getStatusIcon(user.is_active ? 'active' : 'inactive')}
                      {user.is_active ? 'active' : 'inactive'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{user.email}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-gray-500 capitalize">{user.role}</span>
                    <span className="text-gray-500">• {user.bookings?.length || 0} bookings</span>
                    <span className="text-gray-500">• {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
                >
                  <MoreVertical className="w-4 h-4" />
                </motion.button>
              </div>

              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                  onClick={() => window.open(`tel:${user.phone}`)}
                  disabled={!user.phone}
                >
                  <Phone className="w-4 h-4" />
                  Call
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                  onClick={() => window.open(`https://wa.me/${user.phone?.replace(/\s/g, '')}`)}
                  disabled={!user.phone}
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-xl flex items-center justify-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );

  const renderAnalyticsTab = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Revenue Overview */}
      <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Revenue Analytics</h2>
            <p className="text-sm opacity-90">Monthly revenue trends</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {analyticsLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm text-center">
                <div className="h-6 bg-white bg-opacity-30 rounded mb-2"></div>
                <div className="h-4 bg-white bg-opacity-30 rounded"></div>
              </div>
            ))
          ) : analyticsData?.revenueChart ? (
            analyticsData.revenueChart.map((item, index) => (
              <div key={index} className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm text-center">
                <div className="text-lg font-bold">₹{item.revenue}</div>
                <div className="text-sm opacity-90">{item.month}</div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-4">
              <p className="text-sm opacity-90">No revenue data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Rides Overview */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-3xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Rides Analytics</h2>
            <p className="text-sm opacity-90">Monthly ride trends</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          {analyticsLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm text-center">
                <div className="h-6 bg-white bg-opacity-30 rounded mb-2"></div>
                <div className="h-4 bg-white bg-opacity-30 rounded"></div>
              </div>
            ))
          ) : analyticsData?.ridesChart ? (
            analyticsData.ridesChart.map((item, index) => (
              <div key={index} className="bg-white bg-opacity-10 rounded-2xl p-4 backdrop-blur-sm text-center">
                <div className="text-lg font-bold">{item.rides}</div>
                <div className="text-sm opacity-90">{item.month}</div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-4">
              <p className="text-sm opacity-90">No rides data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Top Drivers */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-lg font-bold mb-4">Top Performing Drivers</h3>
        <div className="space-y-3">
          {analyticsLoading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-xl"></div>
              </div>
            ))
          ) : analyticsData?.topDrivers && analyticsData.topDrivers.length > 0 ? (
            analyticsData.topDrivers.map((driver, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{index + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{driver.name}</div>
                  <div className="text-sm text-gray-600">{driver.rides} rides</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{driver.rides}</div>
                  <div className="text-sm text-gray-600">rides</div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <Car className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">No driver data available</p>
            </div>
          )}
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
            <Download className="w-6 h-6 text-blue-600" />
          </div>
          <div className="font-semibold text-gray-900">Export Data</div>
          <div className="text-sm text-gray-600">Download reports</div>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100"
        >
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
            <RefreshCw className="w-6 h-6 text-green-600" />
          </div>
          <div className="font-semibold text-gray-900">Refresh</div>
          <div className="text-sm text-gray-600">Update data</div>
        </motion.button>
      </div>
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
          <h3 className="text-lg font-bold">System Settings</h3>
        </div>
        
        <div className="space-y-1">
          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Security</div>
              <div className="text-sm text-gray-600">Manage system security</div>
            </div>
          </button>

          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <Bell className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Notifications</div>
              <div className="text-sm text-gray-600">Manage system alerts</div>
            </div>
          </button>

          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Payments</div>
              <div className="text-sm text-gray-600">Manage payment settings</div>
            </div>
          </button>

          <button className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-900">Support</div>
              <div className="text-sm text-gray-600">Get help and support</div>
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
            onClick={handleSignOut}
            disabled={signOutLoading}
          >
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-red-600">Sign Out</div>
              <div className="text-sm text-gray-600">Log out of admin panel</div>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'drivers', label: 'Drivers', icon: Car },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: Activity },
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
          
          <h1 className="font-bold text-xl text-gray-900">Admin Panel</h1>
          
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
          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'drivers' && renderDriversTab()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'settings' && renderSettingsTab()}
        </AnimatePresence>
      </div>
    </div>
  );
}
