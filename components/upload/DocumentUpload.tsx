'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, FileText, X, Check, AlertCircle, Download } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { CameraCapture } from '@/components/camera/CameraCapture';
import { useCameraPermissions } from '@/components/camera/CameraCapture';
import toast from 'react-hot-toast';

interface DocumentUploadProps {
  onUpload: (file: File) => void;
  onRemove?: (file: File) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  title?: string;
  description?: string;
  className?: string;
  showPreview?: boolean;
  required?: boolean;
  disabled?: boolean;
}

interface UploadedFile {
  file: File;
  preview?: string;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export function DocumentUpload({
  onUpload,
  onRemove,
  maxFiles = 1,
  maxSize = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  title = 'Upload Document',
  description = 'Upload or capture a document',
  className = '',
  showPreview = true,
  required = false,
  disabled = false
}: DocumentUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [showCamera, setShowCamera] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const { hasPermission, requestPermission } = useCameraPermissions();

  // Handle file selection
  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newFiles: UploadedFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file) continue;
      
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is ${maxSize}MB`);
        continue;
      }

      // Check file type
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a supported file type`);
        continue;
      }

      // Check max files limit
      if (uploadedFiles.length + newFiles.length >= maxFiles) {
        toast.error(`Maximum ${maxFiles} file(s) allowed`);
        break;
      }

      const uploadedFile: UploadedFile = {
        file,
        status: 'uploading'
      };

      // Create preview for images
      if (file.type.startsWith('image/')) {
        uploadedFile.preview = URL.createObjectURL(file);
      }

      newFiles.push(uploadedFile);
    }

    if (newFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      // Simulate upload process
      setIsUploading(true);
      
      for (const uploadedFile of newFiles) {
        try {
          await onUpload(uploadedFile.file);
          setUploadedFiles(prev => 
            prev.map(f => 
              f.file === uploadedFile.file 
                ? { ...f, status: 'success' as const }
                : f
            )
          );
        } catch (error) {
          setUploadedFiles(prev => 
            prev.map(f => 
              f.file === uploadedFile.file 
                ? { ...f, status: 'error' as const, error: 'Upload failed' }
                : f
            )
          );
        }
      }
      
      setIsUploading(false);
    }
  }, [uploadedFiles, maxFiles, maxSize, allowedTypes, onUpload]);

  // Handle camera capture
  const handleCameraCapture = useCallback((file: File) => {
    const dt = new DataTransfer();
    dt.items.add(file);
    handleFileSelect(dt.files);
  }, [handleFileSelect]);

  // Handle drag and drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  // Remove file
  const handleRemoveFile = useCallback((file: File) => {
    setUploadedFiles(prev => {
      const updated = prev.filter(f => f.file !== file);
      const removedFile = prev.find(f => f.file === file);
      
      // Clean up preview URL
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }
      
      return updated;
    });
    
    onRemove?.(file);
  }, [onRemove]);

  // Open camera
  const handleOpenCamera = useCallback(async () => {
    if (!hasPermission) {
      const granted = await requestPermission();
      if (!granted) {
        toast.error('Camera permission is required');
        return;
      }
    }
    setShowCamera(true);
  }, [hasPermission, requestPermission]);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>

      {/* Upload Area */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={maxFiles > 1}
          accept={allowedTypes.join(',')}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={disabled}
        />
        
        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              <span className="text-sm text-gray-600">Upload Files</span>
            </div>
            
            <div className="flex flex-col items-center space-y-2">
              <button
                type="button"
                onClick={handleOpenCamera}
                disabled={disabled}
                className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                <Camera className="w-6 h-6 text-blue-600" />
              </button>
              <span className="text-sm text-gray-600">Take Photo</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Drag and drop files here, or click to browse</p>
            <p className="mt-1">
              Supported formats: {allowedTypes.map(type => type.split('/')[1]).join(', ')} 
              (max {maxSize}MB each)
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">
              Uploaded Files ({uploadedFiles.length}/{maxFiles})
            </h4>
            
            {uploadedFiles.map((uploadedFile, index) => (
              <motion.div
                key={`${uploadedFile.file.name}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {uploadedFile.file.type.startsWith('image/') ? (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      {uploadedFile.preview ? (
                        <Image
                          src={uploadedFile.preview}
                          alt="Preview"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded object-cover"
                        />
                      ) : (
                        <FileText className="w-5 h-5 text-gray-600" />
                      )}
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                      <FileText className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {uploadedFile.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {/* Status */}
                <div className="flex-shrink-0 flex items-center space-x-2">
                  {uploadedFile.status === 'uploading' && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  )}
                  
                  {uploadedFile.status === 'success' && (
                    <Check className="w-4 h-4 text-green-600" />
                  )}
                  
                  {uploadedFile.status === 'error' && (
                    <AlertCircle className="w-4 h-4 text-red-600" />
                  )}

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(uploadedFile.file)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Camera Modal */}
      <AnimatePresence>
        {showCamera && (
          <CameraCapture
            onCapture={handleCameraCapture}
            onClose={() => setShowCamera(false)}
            maxSize={maxSize}
            allowedTypes={allowedTypes.filter(type => type.startsWith('image/'))}
            title="Capture Document"
          />
        )}
      </AnimatePresence>

      {/* Error Messages */}
      {uploadedFiles.some(f => f.status === 'error') && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Some files failed to upload. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}
