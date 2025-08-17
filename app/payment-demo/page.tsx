'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { AuthenticatedRoute } from '@/components/auth/ProtectedRoute';
import { SubscriptionManager } from '@/components/payments/SubscriptionManager';
import { PaymentHistory } from '@/components/payments/PaymentHistory';
import { RazorpayPayment } from '@/components/payments/RazorpayPayment';
import { useAuth } from '@/hooks/useAuth';
import { useDrivers } from '@/hooks/useDrivers';
import { Button } from '@/components/ui/Button';
import { 
  CreditCard, 
  History, 
  Crown, 
  Settings,
  ArrowLeft,
  DollarSign,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';

export default function PaymentDemoPage() {
  const { user, profile, driver } = useAuth();
  const router = useRouter();
  const { drivers } = useDrivers();
  
  const [activeTab, setActiveTab] = useState<'subscription' | 'history' | 'payment'>('subscription');
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const recentDriver = drivers?.[0];

  const _tabs = [
    { id: 'subscription', label: 'Subscription', icon: Crown },
    { id: 'history', label: 'Payment History', icon: History },
    { id: 'payment', label: 'Make Payment', icon: CreditCard },
  ];

  const _handlePaymentSuccess = (paymentId: string) => {
    setShowPaymentModal(false);
    // console.log('Payment successful:', paymentId);
  };

  const _handlePaymentError = (error: string) => {
    console.error('Payment failed:', error);
  };

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
                  <CreditCard className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Payment System Demo</h1>
                  <p className="text-gray-600">Experience the complete payment integration</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
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
                    <span>{tab.label}</span>
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
                {activeTab === 'subscription' && (
                  <motion.div
                    key="subscription"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SubscriptionManager />
                  </motion.div>
                )}

                {activeTab === 'history' && (
                  <motion.div
                    key="history"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <PaymentHistory />
                  </motion.div>
                )}

                {activeTab === 'payment' && (
                  <motion.div
                    key="payment"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Demo</h3>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">Razorpay Integration</h4>
                            <p className="text-sm text-gray-600">Secure payment processing with Razorpay gateway</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">Subscription Management</h4>
                            <p className="text-sm text-gray-600">Handle trial periods, upgrades, and renewals</p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <h4 className="font-medium text-gray-900">Payment History</h4>
                            <p className="text-sm text-gray-600">Track all transactions with detailed analytics</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="font-medium text-blue-900 mb-2">Test Payment</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          Click the button below to test the payment flow with a demo subscription.
                        </p>
                        <Button
                          onClick={() => setShowPaymentModal(true)}
                          size="lg"
                          className="w-full"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Test Payment Flow
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment Features */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Features</h3>
                <div className="space-y-3">
                  {[
                    'Secure Razorpay Integration',
                    'Subscription Management',
                    'Payment History Tracking',
                    'Real-time Status Updates',
                    'Multiple Payment Methods',
                    'Automatic Renewals',
                    'Trial Period Support',
                    'Payment Analytics'
                  ].map((feature, _index) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Payment Stats */}
              <motion.div
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Statistics</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Payments</span>
                    <span className="text-sm text-gray-900">0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Success Rate</span>
                    <span className="text-sm text-gray-900">0%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Total Amount</span>
                    <span className="text-sm text-gray-900">₹0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Active Subscriptions</span>
                    <span className="text-sm text-gray-900">0</span>
                  </div>
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
                  {driver && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Subscription</span>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        driver.subscription_status === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {driver.subscription_status || 'trial'}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        <AnimatePresence>
          {showPaymentModal && recentDriver && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-xl shadow-2xl max-w-md w-full"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Test Payment</h3>
                    <button
                      onClick={() => setShowPaymentModal(false)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    >
                      <AlertCircle className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  
                  <RazorpayPayment
                    subscriptionId="demo-subscription"
                    driverId={recentDriver.id}
                    amount={999}
                    planName="Demo Monthly Subscription"
                                    onSuccess={_handlePaymentSuccess}
                onError={_handlePaymentError}
                  />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AuthenticatedRoute>
  );
}
