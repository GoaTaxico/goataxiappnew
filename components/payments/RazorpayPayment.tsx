'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { usePayments } from '@/hooks/usePayments';
import { supabase } from '@/lib/supabase';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  subscriptionId: string;
  driverId: string;
  amount: number;
  planName: string;
  onSuccess?: (paymentId: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    subscription_id: string;
    driver_id: string;
    plan_name: string;
  };
  theme: {
    color: string;
  };
}

export function RazorpayPayment({
  subscriptionId,
  driverId,
  amount,
  planName,
  onSuccess,
  onError,
  className = '',
}: RazorpayPaymentProps) {
  const { user, profile } = useAuth();
  const { data: payments } = usePayments();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      // console.log('Razorpay script loaded');
    };
    script.onerror = () => {
      console.error('Failed to load Razorpay script');
      toast.error('Failed to load payment gateway');
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const _createRazorpayOrder = async () => {
    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          subscriptionId,
          driverId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create payment order');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const _verifyPayment = async (paymentId: string, orderId: string, signature: string) => {
    try {
      const response = await fetch('/api/razorpay/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          razorpay_payment_id: paymentId,
          razorpay_order_id: orderId,
          razorpay_signature: signature,
          subscriptionId,
          driverId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Payment verification failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const _handlePayment = async () => {
    if (!user || !profile) {
      toast.error('Please login to make a payment');
      return;
    }

    setIsLoading(true);
    setPaymentStatus('processing');

    try {
      // Create Razorpay order
      const order = await _createRazorpayOrder();

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        amount: order.amount,
        currency: order.currency,
        name: 'Goa Taxi App',
        description: `Subscription: ${planName}`,
        order_id: order.order_id,
        handler: async (response: any) => {
          try {
            // Verify payment
            const verification = await _verifyPayment(
              response.razorpay_payment_id,
              response.razorpay_order_id,
              response.razorpay_signature
            );

            if (verification.success) {
              setPaymentStatus('success');
              toast.success('Payment successful!');
              onSuccess?.(verification.payment_id);
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setPaymentStatus('failed');
            toast.error('Payment verification failed');
            onError?.(error instanceof Error ? error.message : 'Payment failed');
          } finally {
            setIsLoading(false);
          }
        },
        prefill: {
          name: profile.full_name || '',
          email: user.email || '',
          contact: profile.phone || '',
        },
        notes: {
          subscription_id: subscriptionId,
          driver_id: driverId,
          plan_name: planName,
        },
        theme: {
          color: '#3B82F6',
        },
      };

      // Initialize Razorpay
      const razorpay = new window.Razorpay(options);
      razorpay.open();

      razorpay.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error);
        setPaymentStatus('failed');
        setIsLoading(false);
        toast.error('Payment failed. Please try again.');
        onError?.(response.error.description || 'Payment failed');
      });

    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      setIsLoading(false);
      toast.error(error instanceof Error ? error.message : 'Payment failed');
      onError?.(error instanceof Error ? error.message : 'Payment failed');
    }
  };

  const _getStatusIcon = () => {
    switch (paymentStatus) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'failed':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'processing':
        return <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />;
      default:
        return <CreditCard className="w-6 h-6 text-gray-500" />;
    }
  };

  const _getStatusText = () => {
    switch (paymentStatus) {
      case 'success':
        return 'Payment Successful';
      case 'failed':
        return 'Payment Failed';
      case 'processing':
        return 'Processing Payment...';
      default:
        return 'Ready to Pay';
    }
  };

  const _getStatusColor = () => {
    switch (paymentStatus) {
      case 'success':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'processing':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Payment Header */}
      <div className="flex items-center space-x-3 mb-6">
        {_getStatusIcon()}
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Payment Details</h3>
          <p className={`text-sm ${_getStatusColor()}`}>{_getStatusText()}</p>
        </div>
      </div>

      {/* Payment Information */}
      <div className="space-y-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Plan</span>
            <span className="text-sm text-gray-900">{planName}</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Amount</span>
            <span className="text-lg font-semibold text-gray-900">₹{amount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Currency</span>
            <span className="text-sm text-gray-900">INR</span>
          </div>
        </div>

        {/* Payment Method Info */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2 mb-2">
            <CreditCard className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Secure Payment</span>
          </div>
          <p className="text-xs text-blue-700">
            Your payment will be processed securely through Razorpay. We support all major credit cards, debit cards, UPI, and net banking.
          </p>
        </div>
      </div>

      {/* Payment Button */}
      <div className="space-y-3">
        <Button
          onClick={_handlePayment}
          disabled={isLoading || paymentStatus === 'processing'}
          className="w-full"
          size="lg"
        >
          {isLoading || paymentStatus === 'processing' ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : paymentStatus === 'success' ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Payment Successful
            </>
          ) : (
            <>
              <CreditCard className="w-4 h-4 mr-2" />
              Pay ₹{amount}
            </>
          )}
        </Button>

        {paymentStatus === 'failed' && (
          <motion.div
            className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">
              Payment failed. Please try again or contact support.
            </span>
          </motion.div>
        )}

        {paymentStatus === 'success' && (
          <motion.div
            className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-sm text-green-700">
              Your subscription has been activated successfully!
            </span>
          </motion.div>
        )}
      </div>

      {/* Security Notice */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>256-bit SSL secured payment</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
          <span>PCI DSS compliant</span>
        </div>
      </div>
    </motion.div>
  );
}
