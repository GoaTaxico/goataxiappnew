import { VehicleType, Location } from '@/types';

// Date and time utilities
export const formatDate = (date: string | Date): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
};

export const formatDateTime = (date: string, time: string): string => {
  return `${formatDate(date)} at ${formatTime(time)}`;
};

export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const getCurrentTime = (): string => {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Distance and location utilities
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  return distance;
};

export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m`;
  }
  return `${distanceKm.toFixed(1)}km`;
};

export const getLocationFromCoordinates = async (
  lat: number,
  lng: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.results && data.results[0]) {
      return data.results[0].formatted_address;
    }
    return `${lat}, ${lng}`;
  } catch (error) {
    console.error('Error getting location:', error);
    return `${lat}, ${lng}`;
  }
};

// Vehicle utilities
export const getVehicleTypeLabel = (type: VehicleType): string => {
  switch (type) {
    case 'hatchback':
      return 'Hatchback';
    case 'sedan':
      return 'Sedan';
    case 'suv':
      return 'SUV';
    default:
      return type;
  }
};

export const getVehicleTypeIcon = (type: VehicleType): string => {
  switch (type) {
    case 'hatchback':
      return '🚗';
    case 'sedan':
      return '🚙';
    case 'suv':
      return '🚐';
    default:
      return '🚗';
  }
};

export const getVehicleCapacity = (type: VehicleType): number => {
  switch (type) {
    case 'hatchback':
      return 4;
    case 'sedan':
      return 4;
    case 'suv':
      return 6;
    default:
      return 4;
  }
};

// Price utilities
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

export const estimateFare = (
  distanceKm: number,
  vehicleType: VehicleType
): number => {
  const baseFare = 50; // Base fare in INR
  const perKmRate = vehicleType === 'suv' ? 15 : 12; // Rate per km
  const estimatedFare = baseFare + (distanceKm * perKmRate);
  return Math.round(estimatedFare);
};

// Phone number utilities
export const formatPhoneNumber = (phone: string): string => {
  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format as Indian phone number
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }
  
  return phone;
};

export const getWhatsAppLink = (phone: string, message?: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const whatsappNumber = cleaned.length === 10 ? `91${cleaned}` : cleaned;
  const encodedMessage = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, '');
  return cleaned.length === 10 || (cleaned.length === 12 && cleaned.startsWith('91'));
};

export const validateLicenseNumber = (license: string): boolean => {
  // Basic validation for Indian driving license format
  const licenseRegex = /^[A-Z]{2}[0-9]{2}[0-9]{4}[0-9]{7}$/;
  return licenseRegex.test(license.replace(/\s/g, ''));
};

export const validateCarNumber = (number: string): boolean => {
  // Basic validation for Indian car number format
  const carNumberRegex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,2}[0-9]{4}$/;
  return carNumberRegex.test(number.replace(/\s/g, '').toUpperCase());
};

// File utilities
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const validateImageFile = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize;
};

// Rating utilities
export const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

export const getRatingColor = (rating: number): string => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-blue-600';
  if (rating >= 3.5) return 'text-yellow-600';
  return 'text-red-600';
};

// Status utilities
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'approved':
    case 'active':
    case 'completed':
      return 'text-green-600 bg-green-100';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100';
    case 'rejected':
    case 'cancelled':
    case 'failed':
      return 'text-red-600 bg-red-100';
    case 'trial':
      return 'text-blue-600 bg-blue-100';
    default:
      return 'text-gray-600 bg-gray-100';
  }
};

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'approved':
      return 'Approved';
    case 'pending':
      return 'Pending';
    case 'rejected':
      return 'Rejected';
    case 'suspended':
      return 'Suspended';
    case 'active':
      return 'Active';
    case 'trial':
      return 'Trial';
    case 'expired':
      return 'Expired';
    case 'cancelled':
      return 'Cancelled';
    case 'completed':
      return 'Completed';
    case 'failed':
      return 'Failed';
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

// Array utilities
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const chunkArray = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Debounce utility
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Local storage utilities
export const setLocalStorage = (key: string, value: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const getLocalStorage = <T>(key: string, defaultValue?: T): T | null => {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  }
  return defaultValue || null;
};

export const removeLocalStorage = (key: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};
