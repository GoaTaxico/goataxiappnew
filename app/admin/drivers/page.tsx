'use client';

import { useState } from 'react';
import { unstable_noStore as noStore } from 'next/cache';

// Force dynamic rendering
noStore();
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useDrivers, usePendingDrivers, useDriverActions } from '@/hooks/useDrivers';
import { AdminRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { 
  Car, 
  Users, 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  MoreVertical,
  ArrowLeft,
  Download,
  RefreshCw,
  Shield,
  Settings,
  LogOut
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminDriversPage() {
  const { user, profile, signOutMutation } = useAuth();
  const router = useRouter();
  const { mutate: signOut, isLoading: signOutLoading } = signOutMutation;
  
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'online' | 'offline'>('all');

  const { drivers: allDrivers = [], isLoading: allDriversLoading } = useDrivers();
  const { drivers: pendingDrivers = [], isLoading: pendingDriversLoading } = usePendingDrivers();
  
  const { approveDriver, rejectDriver, approveLoading, rejectLoading } = useDriverActions();

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
    rejectDriver({ driverId }, {
      onSuccess: () => {
        toast.success('Driver rejected successfully');
      },
      onError: (error) => {
        toast.error('Failed to reject driver');
        console.error('Error rejecting driver:', error);
      },
    });
  };

  // Filter drivers based on active tab and search
  const filteredDrivers = allDrivers.filter(driver => {
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'pending' && driver.status === 'pending') ||
      (activeTab === 'approved' && driver.status === 'approved') ||
      (activeTab === 'rejected' && driver.status === 'rejected');

    const matchesSearch = 
      !searchTerm ||
      driver.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.car_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.car_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      driver.profile?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = 
      statusFilter === 'all' ||
      (statusFilter === 'online' && driver.is_online) ||
      (statusFilter === 'offline' && !driver.is_online);

    return matchesTab && matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100 border-green-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      case 'rejected':
        return 'text-red-600 bg-red-100 border-red-200';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-200';
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
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const tabs = [
    { id: 'all', label: 'All Drivers', count: allDrivers.length },
    { id: 'pending', label: 'Pending', count: pendingDrivers.length },
    { id: 'approved', label: 'Approved', count: allDrivers.filter(d => d.status === 'approved').length },
    { id: 'rejected', label: 'Rejected', count: allDrivers.filter(d => d.status === 'rejected').length },
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
                  <Car className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Driver Management</h1>
                  <p className="text-gray-600">Manage all drivers and applications</p>
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
          {/* Tab Navigation */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id ? 'bg-white bg-opacity-20' : 'bg-gray-200'
                  }`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search drivers by name, vehicle, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Drivers List */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            {(allDriversLoading || pendingDriversLoading) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredDrivers.length === 0 ? (
              <div className="text-center py-12">
                <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No drivers found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDrivers.map((driver, index) => (
                  <motion.div
                    key={driver.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-200"
                  >
                    {/* Driver Header */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {driver.profile?.full_name?.split(' ').map((n: string) => n[0]).join('') || 'D'}
                          </span>
                        </div>
                        {driver.is_online && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-bold text-gray-900">
                            {driver.profile?.full_name || 'Driver'}
                          </h3>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1 ${getStatusColor(driver.status)}`}>
                            {getStatusIcon(driver.status)}
                            <span>{driver.status}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{driver.profile?.email}</p>
                      </div>
                    </div>

                    {/* Driver Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Car className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">{driver.car_name} • {driver.car_number}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-gray-700">
                          {driver.rating ? `${driver.rating}/5` : 'No rating yet'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">
                          {driver.is_online ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">
                          Joined {new Date(driver.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {driver.status === 'pending' && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleApproveDriver(driver.id)}
                            disabled={approveLoading}
                            className="flex-1"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectDriver(driver.id)}
                            disabled={rejectLoading}
                            className="flex-1"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
                      
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${driver.profile?.phone}`)}
                          className="flex-1"
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://wa.me/${driver.profile?.phone?.replace(/\s/g, '')}`)}
                          className="flex-1"
                        >
                          <MessageCircle className="w-4 h-4 mr-1" />
                          WhatsApp
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/drivers/${driver.id}`)}
                        className="w-full"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AdminRoute>
  );
}
