'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from './useAuth';
import toast from 'react-hot-toast';

interface Payment {
  id: string;
  subscription_id: string;
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  subscriptions?: {
    id: string;
    plan_name: string;
    drivers?: {
      id: string;
      car_name: string;
      car_number: string;
      profiles?: {
        full_name: string;
        email: string;
        phone: string;
      };
    };
  };
}

interface Subscription {
  id: string;
  driver_id: string;
  razorpay_subscription_id: string | null;
  razorpay_customer_id: string | null;
  plan_name: string;
  amount: number;
  currency: string;
  status: 'trial' | 'active' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string | null;
  trial_end_date: string;
  created_at: string;
  updated_at: string;
  drivers?: {
    id: string;
    user_id: string;
    car_name: string;
    car_number: string;
    status: string;
    profiles?: {
      full_name: string;
      email: string;
      phone: string;
    };
  };
}

// Fetch payments for the current user
export const usePayments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['payments', user?.id],
    queryFn: async (): Promise<Payment[]> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          subscriptions (
            id,
            plan_name,
            drivers (
              id,
              car_name,
              car_number,
              profiles (
                full_name,
                email,
                phone
              )
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!user,
  });
};

// Fetch subscriptions for the current user
export const useSubscriptions = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['subscriptions', user?.id],
    queryFn: async (): Promise<Subscription[]> => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          drivers (
            id,
            user_id,
            car_name,
            car_number,
            status,
            profiles (
              full_name,
              email,
              phone
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    },
    enabled: !!user,
  });
};

// Create a new subscription
export const useCreateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      driverId,
      planName,
      amount,
      currency = 'INR',
    }: {
      driverId: string;
      planName: string;
      amount: number;
      currency?: string;
    }): Promise<Subscription> => {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          driver_id: driverId,
          plan_name: planName,
          amount,
          currency,
          status: 'trial',
          start_date: new Date().toISOString(),
          trial_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription created successfully');
    },
    onError: (error) => {
      toast.error('Failed to create subscription');
      console.error('Error creating subscription:', error);
    },
  });
};

// Create a new payment record
export const useCreatePayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subscriptionId,
      razorpayPaymentId,
      razorpayOrderId,
      amount,
      currency = 'INR',
      paymentMethod,
      description,
    }: {
      subscriptionId: string;
      razorpayPaymentId: string;
      razorpayOrderId: string;
      amount: number;
      currency?: string;
      paymentMethod?: string;
      description?: string;
    }): Promise<Payment> => {
      const { data, error } = await supabase
        .from('payments')
        .insert({
          subscription_id: subscriptionId,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
          amount,
          currency,
          status: 'completed',
          payment_method: paymentMethod,
          description,
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Payment recorded successfully');
    },
    onError: (error) => {
      toast.error('Failed to record payment');
      console.error('Error creating payment:', error);
    },
  });
};

// Update subscription status
export const useUpdateSubscription = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      subscriptionId,
      updates,
    }: {
      subscriptionId: string;
      updates: Partial<Subscription>;
    }): Promise<Subscription> => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', subscriptionId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      toast.success('Subscription updated successfully');
    },
    onError: (error) => {
      toast.error('Failed to update subscription');
      console.error('Error updating subscription:', error);
    },
  });
};

// Get payment statistics
export const usePaymentStats = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['payment-stats', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('payments')
        .select('amount, status, created_at');

      if (error) {
        throw new Error(error.message);
      }

      const payments = data || [];
      const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
      const completedPayments = payments.filter(p => p.status === 'completed').length;
      const failedPayments = payments.filter(p => p.status === 'failed').length;

      return {
        totalAmount,
        totalPayments: payments.length,
        completedPayments,
        failedPayments,
        successRate: payments.length > 0 ? (completedPayments / payments.length) * 100 : 0,
      };
    },
    enabled: !!user,
  });
};
