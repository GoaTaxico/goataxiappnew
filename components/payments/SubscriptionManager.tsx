'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, CreditCard, CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscriptions, usePayments } from '@/hooks/usePayments';
import { RazorpayPayment } from './RazorpayPayment';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface SubscriptionManagerProps {
  className?: string;
}

export function SubscriptionManager({ className = '' }: SubscriptionManagerProps) {
  const { user, profile, driver } = useAuth();
  const { data: subscriptions = [], isLoading: subscriptionsLoading } = useSubscriptions();
  const { data: payments = [], isLoading: paymentsLoading } = usePayments();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);

  const currentSubscription = subscriptions[0]; // Get the most recent subscription
  const isLoading = subscriptionsLoading || paymentsLoading;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'trial':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5" />;
      case 'trial':
        return <Clock className="w-5 h-5" />;
      case 'expired':
        return <XCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'trial':
        return 'Trial Period';
      case 'expired':
        return 'Expired';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handlePaymentSuccess = (_paymentId: string) => {
    setShowPaymentModal(false);
    setSelectedSubscription(null);
    toast.success('Subscription activated successfully!');
  };

  const handlePaymentError = (error: string) => {
    toast.error(`Payment failed: ${error}`);
  };

  const handleUpgradeSubscription = () => {
    if (!driver) {
      toast.error('Driver profile not found');
      return;
    }

    setSelectedSubscription({
      id: currentSubscription?.id || 'new',
      driverId: driver.id,
      amount: 999,
      planName: 'Monthly Driver Subscription',
    });
    setShowPaymentModal(true);
  };

  if (isLoading) {
    return (
      <motion.div
        className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading subscription details...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Subscription</h3>
              <p className="text-sm text-gray-600">Manage your driver subscription</p>
            </div>
          </div>
        </div>

        {currentSubscription ? (
          <div className="space-y-6">
            {/* Current Subscription Status */}
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                    {getStatusIcon(currentSubscription.status)}
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold">{currentSubscription.plan_name}</h4>
                    <p className="text-sm opacity-90">{getStatusText(currentSubscription.status)}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(currentSubscription.status)}`}>
                  {currentSubscription.status.toUpperCase()}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm text-center">
                  <div className="text-2xl font-bold">₹{currentSubscription.amount}</div>
                  <div className="text-sm opacity-90">Monthly</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 backdrop-blur-sm text-center">
                  <div className="text-lg font-bold">
                    {currentSubscription.end_date ? formatDate(currentSubscription.end_date) : 'N/A'}
                  </div>
                  <div className="text-sm opacity-90">Expires</div>
                </div>
              </div>
            </div>

            {/* Subscription Details */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">Subscription Details</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{formatDate(currentSubscription.start_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trial End:</span>
                  <span className="font-medium">{formatDate(currentSubscription.trial_end_date)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Currency:</span>
                  <span className="font-medium">{currentSubscription.currency}</span>
                </div>
                {currentSubscription.razorpay_subscription_id && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="font-medium text-xs">{currentSubscription.razorpay_subscription_id}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              {currentSubscription.status === 'trial' && (
                <Button
                  onClick={handleUpgradeSubscription}
                  className="w-full"
                  size="lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Upgrade to Paid Plan
                </Button>
              )}

              {currentSubscription.status === 'expired' && (
                <Button
                  onClick={handleUpgradeSubscription}
                  className="w-full"
                  size="lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Renew Subscription
                </Button>
              )}

              {currentSubscription.status === 'active' && (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Your subscription is active</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h4>
            <p className="text-gray-600 mb-6">Get started with a driver subscription to access premium features</p>
            <Button
              onClick={handleUpgradeSubscription}
              size="lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Start Subscription
            </Button>
          </div>
        )}

        {/* Recent Payments */}
        {payments.length > 0 && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h5 className="font-medium text-gray-900 mb-4">Recent Payments</h5>
            <div className="space-y-3">
              {payments.slice(0, 3).map((payment) => (
                <motion.div
                  key={payment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center space-x-3">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {payment.subscriptions?.plan_name || 'Subscription Payment'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">₹{payment.amount}</p>
                    <p className={`text-xs ${
                      payment.status === 'completed' ? 'text-green-600' : 
                      payment.status === 'failed' ? 'text-red-600' : 'text-gray-500'
                    }`}>
                      {payment.status}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedSubscription && (
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
                  <h3 className="text-lg font-semibold text-gray-900">Complete Payment</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  >
                    <XCircle className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                
                <RazorpayPayment
                  subscriptionId={selectedSubscription.id}
                  driverId={selectedSubscription.driverId}
                  amount={selectedSubscription.amount}
                  planName={selectedSubscription.planName}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
