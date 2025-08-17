'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthenticatedRoute } from '@/components/auth/ProtectedRoute';
import { LocationTracker } from '@/components/realtime/LocationTracker';
import { NotificationCenter } from '@/components/realtime/NotificationCenter';
import { BookingStatusTracker } from '@/components/realtime/BookingStatusTracker';
import { DriverStatusMonitor } from '@/components/realtime/DriverStatusMonitor';
import { ChatSystem } from '@/components/realtime/ChatSystem';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { useDrivers } from '@/hooks/useDrivers';
import { Button } from '@/components/ui/Button';
import { 
  Wifi, 
  MapPin, 
  Bell, 
  MessageSquare, 
  Car, 
  Users, 
  Settings,
  ArrowLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

export default function RealtimeDemoPage() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const { bookings } = useBookings();
  const { drivers } = useDrivers();
  
  const [activeTab, setActiveTab] = useState<'location' | 'notifications' | 'booking' | 'driver' | 'chat'>('location');
  const [selectedBookingId, setSelectedBookingId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const recentBooking = bookings?.[0];
  const recentDriver = drivers?.[0];

  const _tabs = [
    { id: 'location', label: 'Location Tracking', icon: MapPin },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'booking', label: 'Booking Status', icon: Car },
    { id: 'driver', label: 'Driver Status', icon: Users },
    { id: 'chat', label: 'Chat System', icon: MessageSquare },
  ];

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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Real-time Features Demo</h1>
                  <p className="text-gray-600">Experience live updates and real-time communication</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <NotificationCenter />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/dashboard')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Tab Navigation */}
          <motion.div
            className="bg-white rounded-xl shadow-lg p-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex space-x-1">
              {_tabs.map((tab) => {
                const _Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <_Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {activeTab === 'location' && (
                  <motion.div
                    key="location"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LocationTracker 
                      isDriver={profile?.role === 'driver'}
                      driverId={profile?.role === 'user' ? recentDriver?.id : undefined}
                      className="mb-6"
                    />
                    
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Tracking Features</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">Real-time GPS Tracking</h4>
                            <p className="text-sm text-gray-600">Drivers can share their location in real-time with users</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">Automatic Updates</h4>
                            <p className="text-sm text-gray-600">Location updates every 5 seconds when tracking is active</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">Connection Status</h4>
                            <p className="text-sm text-gray-600">Real-time connection monitoring with automatic reconnection</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification System</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">Real-time Notifications</h4>
                            <p className="text-sm text-gray-600">Instant notifications for booking updates, driver status changes, and system messages</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">Smart Filtering</h4>
                            <p className="text-sm text-gray-600">Filter notifications by type (booking, driver, system) and read status</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">Bulk Actions</h4>
                            <p className="text-sm text-gray-600">Mark all as read, delete notifications, and manage notification preferences</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'booking' && (
                  <motion.div
                    key="booking"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {recentBooking ? (
                      <BookingStatusTracker 
                        bookingId={recentBooking.id}
                        className="mb-6"
                      />
                    ) : (
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
                        <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Bookings Available</h3>
                        <p className="text-gray-600 mb-4">Create a booking to see real-time status tracking</p>
                        <Button onClick={() => router.push('/')}>
                          Book a Ride
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'driver' && (
                  <motion.div
                    key="driver"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    {recentDriver ? (
                      <DriverStatusMonitor 
                        driverId={recentDriver.id}
                        showLocation={true}
                        className="mb-6"
                      />
                    ) : (
                      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Drivers Available</h3>
                        <p className="text-gray-600">No drivers are currently registered in the system</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Chat System</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">Instant Messaging</h4>
                            <p className="text-sm text-gray-600">Real-time chat between users and drivers with instant message delivery</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">Message Status</h4>
                            <p className="text-sm text-gray-600">Read receipts, typing indicators, and message timestamps</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">Push Notifications</h4>
                            <p className="text-sm text-gray-600">Get notified of new messages even when the chat is closed</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Chat Demo</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          The chat system is available as a floating button in the bottom-right corner of the screen.
                        </p>
                        <p className="text-sm text-blue-600">
                          Click the chat icon to start a conversation with another user or driver.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Connection Status */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Connection Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Real-time Connection</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">WebSocket Status</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Database Sync</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-green-600">Synced</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Feature List */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Real-time Features</h3>
                <div className="space-y-3">
                  {[
                    'Live Location Tracking',
                    'Instant Notifications',
                    'Booking Status Updates',
                    'Driver Status Monitoring',
                    'Real-time Chat',
                    'Connection Monitoring',
                    'Automatic Reconnection',
                    'Push Notifications'
                  ].map((feature, _index) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* User Info */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Account</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Role</span>
                    <span className="text-sm text-gray-900 capitalize">{profile?.role || 'User'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Name</span>
                    <span className="text-sm text-gray-900">{profile?.full_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Email</span>
                    <span className="text-sm text-gray-900">{user?.email || 'N/A'}</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Chat System (floating) */}
        {recentDriver && (
          <ChatSystem
            receiverId={recentDriver.user_id}
            receiverName={recentDriver.profile?.full_name}
            receiverRole="driver"
          />
        )}
      </div>
    </AuthenticatedRoute>
  );
}
