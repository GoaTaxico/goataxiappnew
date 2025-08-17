'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Trash2, MessageSquare, Car } from 'lucide-react';
import { useNotifications, useMarkNotificationAsRead, useMarkAllNotificationsAsRead, useDeleteNotification } from '@/hooks/useNotifications';
import { useAuth } from '@/hooks/useAuth';
import { useRealtime } from '@/hooks/useRealtime';
import toast from 'react-hot-toast';

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const { subscribeToBookings } = useRealtime();
  
  const { data: notifications = [], isLoading } = useNotifications(user?.id || '');
  const { data: unreadCountData } = useNotifications(user?.id || '');
  const _markAsRead = useMarkNotificationAsRead();
  const markAllAsRead = useMarkAllNotificationsAsRead();
  const _deleteNotification = useDeleteNotification();

  // Subscribe to real-time booking updates
  useEffect(() => {
    if (!user?.id) return;

    const _channel = subscribeToBookings(
      (update) => {
        // Handle real-time booking updates
        // console.log('Booking update received:', update);
        
        // You can add logic here to create notifications for booking updates
        // For example, notify users when their booking status changes
        if (update.user_id === user.id) {
          let title = '';
          let message = '';
          
          switch (update.status) {
            case 'accepted':
              title = 'Booking Accepted';
              message = `Your booking from ${update.pickup_location} to ${update.drop_location} has been accepted by a driver.`;
              break;
            case 'completed':
              title = 'Ride Completed';
              message = `Your ride from ${update.pickup_location} to ${update.drop_location} has been completed.`;
              break;
            case 'cancelled':
              title = 'Booking Cancelled';
              message = `Your booking from ${update.pickup_location} to ${update.drop_location} has been cancelled.`;
              break;
          }
          
          if (title && message) {
            // This would typically be handled by the backend
            // console.log('Should create notification:', { title, message });
          }
        }
      },
      { user_id: user.id }
    );

    return () => {
      if (_channel) {
        // Cleanup will be handled by useRealtime hook
      }
    };
  }, [user?.id, subscribeToBookings]);

  // Update unread count
  useEffect(() => {
    if (notifications) {
      const count = notifications.filter(n => !n.is_read).length;
      setUnreadCount(count);
    }
  }, [notifications]);

  const _handleMarkAsRead = (notificationId: string) => {
    _markAsRead.mutate(notificationId);
  };

  const _handleMarkAllAsRead = () => {
    markAllAsRead.mutate();
  };

  const _handleDeleteNotification = (notificationId: string) => {
    _deleteNotification.mutate(notificationId);
  };

  const _getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Car className="w-5 h-5 text-blue-600" />;
      case 'driver':
        return <Car className="w-5 h-5 text-green-600" />;
      default:
        return <MessageSquare className="w-5 h-5 text-gray-600" />;
    }
  };

  const _getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'border-l-blue-500 bg-blue-50';
      case 'driver':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Notification Bell */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="w-6 h-6 text-gray-600" />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.div
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 top-12 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={_handleMarkAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    disabled={markAllAsRead.isPending}
                  >
                    {markAllAsRead.isPending ? 'Marking...' : 'Mark all read'}
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading notifications...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No notifications yet</p>
                  <p className="text-sm text-gray-400 mt-1">We&apos;ll notify you when something happens</p>
                </div>
              ) : (
                <div className="p-2">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      className={`mb-2 p-3 rounded-lg border-l-4 ${_getNotificationColor(notification.type)} ${
                        !notification.is_read ? 'ring-2 ring-blue-100' : ''
                      }`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {_getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <p className={`text-sm font-medium ${
                                notification.is_read ? 'text-gray-700' : 'text-gray-900'
                              }`}>
                                {notification.title}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-2">
                                {new Date(notification.created_at).toLocaleString()}
                              </p>
                            </div>
                            
                            <div className="flex items-center space-x-1 ml-2">
                              {!notification.is_read && (
                                <button
                                  onClick={() => _handleMarkAsRead(notification.id)}
                                  className="p-1 rounded-full hover:bg-green-100 transition-colors duration-200"
                                  title="Mark as read"
                                >
                                  <Check className="w-3 h-3 text-green-600" />
                                </button>
                              )}
                              <button
                                onClick={() => _handleDeleteNotification(notification.id)}
                                className="p-1 rounded-full hover:bg-red-100 transition-colors duration-200"
                                title="Delete notification"
                              >
                                <Trash2 className="w-3 h-3 text-red-600" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</span>
                  <span>{unreadCount} unread</span>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
