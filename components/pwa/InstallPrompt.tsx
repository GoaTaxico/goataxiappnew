'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '@/hooks/usePWA';
import { Button } from '@/components/ui/Button';
import { 
  Download, 
  X, 
  Smartphone, 
  Wifi, 
  WifiOff,
  Bell,
  BellOff
} from 'lucide-react';
import toast from 'react-hot-toast';

interface InstallPromptProps {
  className?: string;
}

export function InstallPrompt({ className = '' }: InstallPromptProps) {
  const { 
    isInstalled, 
    isOnline, 
    hasUpdate, 
    isSupported, 
    installPWA, 
    updateApp,
    requestNotificationPermission,
    sendPushNotification,
    subscribeToPushNotifications
  } = usePWA();

  const [showPrompt, setShowPrompt] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  // Check if install prompt should be shown
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasShownPrompt = localStorage.getItem('pwa-install-prompt-shown');
      const shouldShow = !isInstalled && isSupported && !hasShownPrompt;
      
      if (shouldShow) {
        // Delay showing the prompt
        const timer = setTimeout(() => {
          setShowPrompt(true);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [isInstalled, isSupported]);

  // Check notification permission
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  const handleInstall = () => {
    installPWA();
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-shown', 'true');
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-prompt-shown', 'true');
  };

  const handleUpdate = () => {
    updateApp();
    setShowPrompt(false);
  };

  const handleRequestNotificationPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setNotificationPermission('granted');
      setShowNotificationPrompt(false);
      toast.success('Notifications enabled!');
      
      // Subscribe to push notifications
      const subscription = await subscribeToPushNotifications();
      if (subscription) {
        // Send subscription to server
        try {
          await fetch('/api/notifications/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ subscription }),
          });
        } catch (error) {
          console.error('Error saving notification subscription:', error);
        }
      }
    } else {
      toast.error('Notification permission denied');
    }
  };

  const handleTestNotification = async () => {
    const success = await sendPushNotification('Test Notification', {
      body: 'This is a test notification from Goa Taxi!',
      tag: 'test-notification',
    });
    
    if (success) {
      toast.success('Test notification sent!');
    } else {
      toast.error('Failed to send test notification');
    }
  };

  return (
    <>
      {/* Install/Update Prompt */}
      <AnimatePresence>
        {showPrompt && (hasUpdate || (!isInstalled && isSupported)) && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-4 left-4 right-4 z-50 ${className}`}
          >
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm mx-auto">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Download className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {hasUpdate ? 'Update Available' : 'Install Goa Taxi'}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {hasUpdate 
                      ? 'A new version is available with improved features.'
                      : 'Install our app for a better experience with offline access.'
                    }
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      size="sm"
                      onClick={hasUpdate ? handleUpdate : handleInstall}
                      className="flex-1"
                    >
                      {hasUpdate ? 'Update Now' : 'Install'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDismiss}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Permission Prompt */}
      <AnimatePresence>
        {showNotificationPrompt && notificationPermission === 'default' && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 z-50"
          >
            <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm mx-auto">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Enable Notifications
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Get notified about booking updates, driver arrivals, and special offers.
                  </p>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      size="sm"
                      onClick={handleRequestNotificationPermission}
                      className="flex-1"
                    >
                      Enable
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowNotificationPrompt(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Status Indicators */}
      <div className="fixed top-4 right-4 z-40 space-y-2">
        {/* Online/Offline Status */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-2 bg-white rounded-full shadow-lg px-3 py-2 border border-gray-200"
        >
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-red-600" />
          )}
          <span className="text-xs font-medium text-gray-700">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </motion.div>

        {/* Notification Status */}
        {notificationPermission !== 'default' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 bg-white rounded-full shadow-lg px-3 py-2 border border-gray-200"
          >
            {notificationPermission === 'granted' ? (
              <Bell className="w-4 h-4 text-green-600" />
            ) : (
              <BellOff className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-xs font-medium text-gray-700">
              {notificationPermission === 'granted' ? 'Notifications On' : 'Notifications Off'}
            </span>
            {notificationPermission === 'granted' && (
              <button
                onClick={handleTestNotification}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                Test
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Notification Permission Button (for testing) */}
      {notificationPermission === 'default' && (
        <button
          onClick={() => setShowNotificationPrompt(true)}
          className="fixed bottom-4 right-4 z-30 bg-blue-600 text-white rounded-full p-3 shadow-lg hover:bg-blue-700 transition-colors"
        >
          <Bell className="w-5 h-5" />
        </button>
      )}
    </>
  );
}
