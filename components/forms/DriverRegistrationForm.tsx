'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  Car, 
  User, 
  Phone, 
  Mail, 
  FileText, 
  Upload, 
  CheckCircle,
  AlertCircle,
  Loader2 
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

const driverRegistrationSchema = z.object({
  // Personal Information
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  whatsapp: z.string().min(10, 'Please enter a valid WhatsApp number'),
  
  // Vehicle Information
  license_number: z.string().min(5, 'License number must be at least 5 characters'),
  vehicle_type: z.enum(['sedan', 'suv', 'hatchback', 'luxury', 'auto']),
  car_name: z.string().min(2, 'Car name is required'),
  car_number: z.string().min(5, 'Car number must be at least 5 characters'),
  car_color: z.string().min(2, 'Car color is required'),
  car_model_year: z.string().min(4, 'Please enter a valid year'),
  
  // Documents
  license_image: z.instanceof(File).optional(),
  rc_book_image: z.instanceof(File).optional(),
  insurance_image: z.instanceof(File).optional(),
  profile_image: z.instanceof(File).optional(),
});

type DriverRegistrationData = z.infer<typeof driverRegistrationSchema>;

interface DriverRegistrationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}

export function DriverRegistrationForm({
  onSuccess,
  onCancel,
  className = '',
}: DriverRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const { profile, updateProfile } = useAuth();

  const form = useForm<DriverRegistrationData>({
    resolver: zodResolver(driverRegistrationSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      whatsapp: profile?.whatsapp || '',
      vehicle_type: 'sedan',
      car_name: '',
      car_number: '',
      car_color: '',
      car_model_year: '',
    },
  });

  const handleFileUpload = async (file: File, type: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${type}`);
    }

    const data = await response.json();
    return data.url;
  };

  const handleSubmit = async (data: DriverRegistrationData) => {
    setIsSubmitting(true);
    setUploadProgress({});

    try {
      // Upload files
      const uploadPromises: Promise<{ type: string; url: string }>[] = [];
      
      if (data.license_image) {
        uploadPromises.push(
          handleFileUpload(data.license_image, 'license').then(url => ({ type: 'license', url }))
        );
      }
      if (data.rc_book_image) {
        uploadPromises.push(
          handleFileUpload(data.rc_book_image, 'rc_book').then(url => ({ type: 'rc_book', url }))
        );
      }
      if (data.insurance_image) {
        uploadPromises.push(
          handleFileUpload(data.insurance_image, 'insurance').then(url => ({ type: 'insurance', url }))
        );
      }
      if (data.profile_image) {
        uploadPromises.push(
          handleFileUpload(data.profile_image, 'profile').then(url => ({ type: 'profile', url }))
        );
      }

      // Wait for all uploads to complete
      const uploadResults = await Promise.all(uploadPromises);
      const uploadedFiles = uploadResults.reduce((acc, { type, url }) => {
        acc[`${type}_url`] = url;
        return acc;
      }, {} as Record<string, string>);

      // Register as driver
      const response = await fetch('/api/drivers/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          license_number: data.license_number,
          vehicle_type: data.vehicle_type,
          car_name: data.car_name,
          car_number: data.car_number,
          car_color: data.car_color,
          car_model_year: data.car_model_year,
          phone: data.phone,
          whatsapp: data.whatsapp,
          ...uploadedFiles,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register as driver');
      }

      // Update profile with new information
      updateProfile({
        full_name: data.full_name,
        phone: data.phone,
        whatsapp: data.whatsapp,
        role: 'driver',
      });

      toast.success('Driver registration submitted successfully! Please wait for admin approval.');
      onSuccess?.();

    } catch (error) {
      console.error('Driver registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to register as driver');
    } finally {
      setIsSubmitting(false);
      setUploadProgress({});
    }
  };

  const vehicleTypes = [
    { value: 'sedan', label: 'Sedan' },
    { value: 'suv', label: 'SUV' },
    { value: 'hatchback', label: 'Hatchback' },
    { value: 'luxury', label: 'Luxury' },
    { value: 'auto', label: 'Auto Rickshaw' },
  ];

  return (
    <motion.div
      className={`max-w-2xl mx-auto ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Car className="w-8 h-8 text-blue-600" />
          </motion.div>
          <motion.h2
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Become a Driver
          </motion.h2>
          <motion.p
            className="text-gray-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Join our network of trusted drivers and start earning
          </motion.p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Personal Information */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  {...form.register('full_name')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your full name"
                />
                {form.formState.errors.full_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.full_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  {...form.register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your phone number"
                />
                {form.formState.errors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp Number
                </label>
                <input
                  {...form.register('whatsapp')}
                  type="tel"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your WhatsApp number"
                />
                {form.formState.errors.whatsapp && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.whatsapp.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  License Number
                </label>
                <input
                  {...form.register('license_number')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your license number"
                />
                {form.formState.errors.license_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.license_number.message}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Vehicle Information */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Car className="w-5 h-5" />
              Vehicle Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Type
                </label>
                <select
                  {...form.register('vehicle_type')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {vehicleTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                {form.formState.errors.vehicle_type && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.vehicle_type.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Name/Model
                </label>
                <input
                  {...form.register('car_name')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., Honda City, Swift Dzire"
                />
                {form.formState.errors.car_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.car_name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Number
                </label>
                <input
                  {...form.register('car_number')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., GA-01-AB-1234"
                />
                {form.formState.errors.car_number && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.car_number.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Car Color
                </label>
                <input
                  {...form.register('car_color')}
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., White, Black, Silver"
                />
                {form.formState.errors.car_color && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.car_color.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model Year
                </label>
                <input
                  {...form.register('car_model_year')}
                  type="number"
                  min="1990"
                  max={new Date().getFullYear() + 1}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="e.g., 2020"
                />
                {form.formState.errors.car_model_year && (
                  <p className="mt-1 text-sm text-red-600">
                    {form.formState.errors.car_model_year.message}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Document Upload */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Required Documents
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'license_image', label: 'Driving License', required: true },
                { name: 'rc_book_image', label: 'RC Book', required: true },
                { name: 'insurance_image', label: 'Insurance', required: true },
                { name: 'profile_image', label: 'Profile Photo', required: false },
              ].map((doc) => (
                <div key={doc.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {doc.label} {doc.required && <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          form.setValue(doc.name as keyof DriverRegistrationData, file);
                        }
                      }}
                      className="hidden"
                      id={doc.name}
                    />
                    <label
                      htmlFor={doc.name}
                      className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Upload className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">Upload {doc.label}</span>
                    </label>
                  </div>
                  {form.formState.errors[doc.name as keyof DriverRegistrationData] && (
                    <p className="mt-1 text-sm text-red-600">
                      {form.formState.errors[doc.name as keyof DriverRegistrationData]?.message}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Subscription Info */}
          <motion.div
            className="bg-blue-50 rounded-xl p-4 border border-blue-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-900">Subscription Information</h4>
                <p className="text-sm text-blue-700 mt-1">
                  • 30-day free trial period<br />
                  • ₹999/month subscription after trial<br />
                  • No booking fees - direct payment from customers<br />
                  • Keep 100% of your earnings
                </p>
              </div>
            </div>
          </motion.div>

          {/* Submit Buttons */}
          <motion.div
            className="flex gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
            
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1"
                size="lg"
              >
                Cancel
              </Button>
            )}
          </motion.div>
        </form>
      </div>
    </motion.div>
  );
}
