'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Search, Filter, Download, Calendar, DollarSign, CheckCircle, XCircle, Clock } from 'lucide-react';
import { usePayments } from '@/hooks/usePayments';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

interface PaymentHistoryProps {
  className?: string;
}

export function PaymentHistory({ className = '' }: PaymentHistoryProps) {
  const { data: payments = [], isLoading } = usePayments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'failed' | 'pending'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Filter payments based on search and filters
  const filteredPayments = useMemo(() => {
    let filtered = payments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.subscriptions?.plan_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.razorpay_payment_id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      filtered = filtered.filter(payment => {
        const paymentDate = new Date(payment.created_at);
        switch (dateFilter) {
          case 'today':
            return paymentDate >= today;
          case 'week':
            return paymentDate >= weekAgo;
          case 'month':
            return paymentDate >= monthAgo;
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [payments, searchTerm, statusFilter, dateFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const completedPayments = filteredPayments.filter(p => p.status === 'completed').length;
    const failedPayments = filteredPayments.filter(p => p.status === 'failed').length;
    const pendingPayments = filteredPayments.filter(p => p.status === 'pending').length;

    return {
      totalAmount,
      totalPayments: filteredPayments.length,
      completedPayments,
      failedPayments,
      pendingPayments,
      successRate: filteredPayments.length > 0 ? (completedPayments / filteredPayments.length) * 100 : 0,
    };
  }, [filteredPayments]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportToCSV = () => {
    if (filteredPayments.length === 0) {
      toast.error('No payments to export');
      return;
    }

    const headers = ['Date', 'Plan', 'Amount', 'Status', 'Payment Method', 'Payment ID'];
    const csvContent = [
      headers.join(','),
      ...filteredPayments.map(payment => [
        formatDate(payment.created_at),
        payment.subscriptions?.plan_name || 'N/A',
        payment.amount,
        payment.status,
        payment.payment_method || 'N/A',
        payment.razorpay_payment_id || 'N/A',
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payment-history-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success('Payment history exported successfully');
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
          <span className="ml-3 text-gray-600">Loading payment history...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`bg-white rounded-xl shadow-lg p-6 border border-gray-200 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">Payment History</h3>
            <p className="text-sm text-gray-600">Track all your subscription payments</p>
          </div>
        </div>
        <Button
          onClick={exportToCSV}
          variant="outline"
          size="sm"
          disabled={filteredPayments.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center space-x-2">
            <DollarSign className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">Total Amount</span>
          </div>
          <p className="text-lg font-bold text-blue-900">₹{stats.totalAmount.toFixed(2)}</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-900">Completed</span>
          </div>
          <p className="text-lg font-bold text-green-900">{stats.completedPayments}</p>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="flex items-center space-x-2">
            <XCircle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-900">Failed</span>
          </div>
          <p className="text-lg font-bold text-red-900">{stats.failedPayments}</p>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-900">Success Rate</span>
          </div>
          <p className="text-lg font-bold text-yellow-900">{stats.successRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Payment List */}
      <div className="space-y-3">
        {filteredPayments.length === 0 ? (
          <div className="text-center py-8">
            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No payments found</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          filteredPayments.map((payment, index) => (
            <motion.div
              key={payment.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                  {getStatusIcon(payment.status)}
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">
                    {payment.subscriptions?.plan_name || 'Subscription Payment'}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(payment.created_at)}</span>
                    </span>
                    {payment.payment_method && (
                      <span>{payment.payment_method}</span>
                    )}
                  </div>
                  {payment.description && (
                    <p className="text-xs text-gray-400 mt-1">{payment.description}</p>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">₹{payment.amount}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
                {payment.razorpay_payment_id && (
                  <p className="text-xs text-gray-400 mt-1">{payment.razorpay_payment_id}</p>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Summary */}
      {filteredPayments.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Showing {filteredPayments.length} of {payments.length} payments</span>
            <span>Total: ₹{stats.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
