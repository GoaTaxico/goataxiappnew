'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { DriverRegistrationForm } from '@/components/forms/DriverRegistrationForm';
import { AuthenticatedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DriverRegistrationPage() {
  const { user, profile, driver } = useAuth();
  const router = useRouter();

  // Redirect if already a driver
  useEffect(() => {
    if (driver) {
      router.push('/driver');
    }
  }, [driver, router]);

  const _handleSuccess = () => {
    router.push('/driver');
  };

  const handleCancel = () => {
    router.back();
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
            <div className="flex items-center py-6">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="mr-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Driver Registration</h1>
                <p className="text-gray-600">Join our network of trusted drivers</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DriverRegistrationForm
            onSuccess={() => {
              toast.success('Driver registration submitted successfully!');
              router.push('/driver');
            }}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </AuthenticatedRoute>
  );
}
