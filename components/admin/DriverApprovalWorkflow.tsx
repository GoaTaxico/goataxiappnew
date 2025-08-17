'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Car, 
  User, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Download,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

interface DriverApplication {
  id: string;
  user_id: string;
  vehicle_type: string;
  vehicle_number: string;
  license_number: string;
  car_name: string;
  car_number: string;
  is_available: boolean;
  current_location: string;
  rating: number;
  total_rides: number;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  documents: {
    license: string;
    rc_book: string;
    insurance: string;
    permit: string;
  };
  created_at: string;
  profile: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    avatar_url: string;
    created_at: string;
  };
}

interface DriverApprovalWorkflowProps {
  driver: DriverApplication;
  onApprove: (driverId: string, reason?: string) => void;
  onReject: (driverId: string, reason: string) => void;
  onSuspend: (driverId: string, reason: string) => void;
  isLoading?: boolean;
}

export function DriverApprovalWorkflow({
  driver,
  onApprove,
  onReject,
  onSuspend,
  isLoading = false,
}: DriverApprovalWorkflowProps) {
  const [selectedAction, setSelectedAction] = useState<'approve' | 'reject' | 'suspend' | null>(null);
  const [reason, setReason] = useState('');
  const [showDocuments, setShowDocuments] = useState(false);

  const handleAction = () => {
    if (!selectedAction) return;

    if (selectedAction === 'approve') {
      onApprove(driver.id, reason);
    } else if (selectedAction === 'reject') {
      if (!reason.trim()) {
        toast.error('Please provide a reason for rejection');
        return;
      }
      onReject(driver.id, reason);
    } else if (selectedAction === 'suspend') {
      if (!reason.trim()) {
        toast.error('Please provide a reason for suspension');
        return;
      }
      onSuspend(driver.id, reason);
    }
  };

  const downloadDocument = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-50';
      case 'approved':
        return 'text-green-600 bg-green-50';
      case 'rejected':
        return 'text-red-600 bg-red-50';
      case 'suspended':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'suspended':
        return 'Suspended';
      default:
        return status;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg border border-gray-200 p-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <Car className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {driver.profile.full_name}
            </h2>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(driver.status)}`}>
                {getStatusText(driver.status)}
              </span>
              <span className="text-sm text-gray-500">
                Applied {new Date(driver.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Driver Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Driver Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{driver.profile.full_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{driver.profile.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{driver.profile.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <MapPin className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{driver.current_location}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium">
                  {new Date(driver.profile.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Vehicle Information</h3>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Car className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Vehicle Type</p>
                <p className="font-medium capitalize">{driver.vehicle_type}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Car className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Car Model</p>
                <p className="font-medium">{driver.car_name}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Car className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">Vehicle Number</p>
                <p className="font-medium">{driver.vehicle_number}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-sm text-gray-600">License Number</p>
                <p className="font-medium">{driver.license_number}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDocuments(!showDocuments)}
          >
            <Eye className="w-4 h-4 mr-2" />
            {showDocuments ? 'Hide' : 'View'} Documents
          </Button>
        </div>

        {showDocuments && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {Object.entries(driver.documents).map(([type, url]) => (
              <div key={type} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="font-medium capitalize">{type.replace('_', ' ')}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => downloadDocument(url, `${type}_${driver.id}.pdf`)}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
                <div className="mt-2">
                  <img
                    src={url}
                    alt={`${type} document`}
                    className="w-full h-32 object-cover rounded border"
                  />
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Approval Actions */}
      {driver.status === 'pending' && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Decision</h3>
          
          <div className="space-y-4">
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={() => setSelectedAction('approve')}
                className={`flex-1 ${selectedAction === 'approve' ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'}`}
                disabled={isLoading}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
              
              <Button
                onClick={() => setSelectedAction('reject')}
                variant="outline"
                className={`flex-1 ${selectedAction === 'reject' ? 'border-red-500 text-red-600' : ''}`}
                disabled={isLoading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              
              <Button
                onClick={() => setSelectedAction('suspend')}
                variant="outline"
                className={`flex-1 ${selectedAction === 'suspend' ? 'border-orange-500 text-orange-600' : ''}`}
                disabled={isLoading}
              >
                <XCircle className="w-4 h-4 mr-2" />
                Suspend
              </Button>
            </div>

            {/* Reason Input */}
            {(selectedAction === 'reject' || selectedAction === 'suspend') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for {selectedAction === 'reject' ? 'rejection' : 'suspension'}
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder={`Enter reason for ${selectedAction === 'reject' ? 'rejection' : 'suspension'}...`}
                />
              </div>
            )}

            {/* Submit Button */}
            {selectedAction && (
              <Button
                onClick={handleAction}
                disabled={isLoading || (selectedAction !== 'approve' && !reason.trim())}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Processing...
                  </>
                ) : (
                  `Confirm ${selectedAction === 'approve' ? 'Approval' : selectedAction === 'reject' ? 'Rejection' : 'Suspension'}`
                )}
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Status History */}
      {driver.status !== 'pending' && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status History</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                driver.status === 'approved' ? 'bg-green-500' : 
                driver.status === 'rejected' ? 'bg-red-500' : 
                'bg-orange-500'
              }`}></div>
              <span className="font-medium">
                {getStatusText(driver.status)} on {new Date(driver.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
