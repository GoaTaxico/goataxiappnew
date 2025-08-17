import { z } from 'zod';
import { createValidationError } from './errorHandling';

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces');

export const coordinateSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const addressSchema = z
  .string()
  .min(5, 'Address must be at least 5 characters')
  .max(200, 'Address must be less than 200 characters');

// User validation schemas
export const userRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema.optional(),
  role: z.enum(['user', 'driver', 'admin']).default('user'),
});

export const userUpdateSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema.optional(),
  avatar: z.string().url().optional(),
});

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

// Driver validation schemas
export const driverRegistrationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  phone: phoneSchema,
  licenseNumber: z.string().min(5, 'License number must be at least 5 characters'),
  vehicleNumber: z.string().min(5, 'Vehicle number must be at least 5 characters'),
  vehicleModel: z.string().min(2, 'Vehicle model must be at least 2 characters'),
  vehicleType: z.enum(['sedan', 'suv', 'hatchback', 'luxury']),
  documents: z.object({
    license: z.string().url('Invalid license URL'),
    rc: z.string().url('Invalid RC URL'),
    insurance: z.string().url('Invalid insurance URL'),
  }),
});

export const driverUpdateSchema = z.object({
  firstName: nameSchema.optional(),
  lastName: nameSchema.optional(),
  phone: phoneSchema.optional(),
  licenseNumber: z.string().min(5).optional(),
  vehicleNumber: z.string().min(5).optional(),
  vehicleModel: z.string().min(2).optional(),
  vehicleType: z.enum(['sedan', 'suv', 'hatchback', 'luxury']).optional(),
  documents: z.object({
    license: z.string().url().optional(),
    rc: z.string().url().optional(),
    insurance: z.string().url().optional(),
  }).optional(),
});

// Booking validation schemas
export const bookingCreateSchema = z.object({
  pickupLocation: addressSchema,
  dropLocation: addressSchema,
  pickupCoordinates: coordinateSchema,
  dropCoordinates: coordinateSchema,
  pickupTime: z.string().datetime(),
  passengerCount: z.number().min(1).max(10),
  specialRequests: z.string().max(500).optional(),
  paymentMethod: z.enum(['cash', 'card', 'upi']).default('cash'),
});

export const bookingUpdateSchema = z.object({
  pickupLocation: addressSchema.optional(),
  dropLocation: addressSchema.optional(),
  pickupCoordinates: coordinateSchema.optional(),
  dropCoordinates: coordinateSchema.optional(),
  pickupTime: z.string().datetime().optional(),
  passengerCount: z.number().min(1).max(10).optional(),
  specialRequests: z.string().max(500).optional(),
  status: z.enum(['pending', 'confirmed', 'in_progress', 'completed', 'cancelled']).optional(),
});

// Payment validation schemas
export const paymentCreateSchema = z.object({
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('INR'),
  paymentMethod: z.enum(['razorpay', 'cash', 'card']),
  bookingId: z.string().uuid('Invalid booking ID'),
});

export const subscriptionCreateSchema = z.object({
  planId: z.string().min(1, 'Plan ID is required'),
  duration: z.enum(['monthly', 'quarterly', 'yearly']),
  autoRenew: z.boolean().default(true),
});

// Location validation schemas
export const locationUpdateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  accuracy: z.number().positive().optional(),
  timestamp: z.string().datetime().optional(),
});

// File upload validation schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  type: z.enum(['license', 'rc', 'insurance', 'avatar', 'document']),
  maxSize: z.number().default(5 * 1024 * 1024), // 5MB default
});

// Validation helper functions
export const validateInput = <T>(
  schema: z.ZodSchema<T>,
  data: unknown,
  context?: string
): T => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const message = `Validation failed${context ? ` for ${context}` : ''}: ${(error as any).errors?.map((e: any) => e.message).join(', ') || 'Unknown validation error'}`;
      throw createValidationError(message, { errors: (error as any).errors || [], context });
    }
    throw error;
  }
};

export const validateInputSafe = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: (error as any).errors?.map((e: any) => e.message) || ['Unknown validation error'],
      };
    }
    return {
      success: false,
      errors: ['Unknown validation error'],
    };
  }
};

// Sanitization functions
export const sanitizeString = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/[&]/g, '&amp;') // Escape ampersands
    .replace(/["]/g, '&quot;') // Escape quotes
    .replace(/[']/g, '&#x27;') // Escape apostrophes
    .replace(/[/]/g, '&#x2F;'); // Escape forward slashes
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/\s+/g, '').replace(/[^\d+]/g, '');
};

export const sanitizeAddress = (address: string): string => {
  return address
    .trim()
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 200); // Limit length
};

// Rate limiting validation
export const validateRateLimit = (
  attempts: number,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
): boolean => {
  return attempts < maxAttempts;
};

// File validation
export const validateFile = (
  file: File,
  allowedTypes: string[],
  maxSize: number = 5 * 1024 * 1024 // 5MB
): { valid: boolean; error?: string } => {
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`,
    };
  }

  return { valid: true };
};

// Coordinate validation
export const validateCoordinates = (
  lat: number,
  lng: number
): { valid: boolean; error?: string } => {
  if (lat < -90 || lat > 90) {
    return {
      valid: false,
      error: 'Latitude must be between -90 and 90 degrees',
    };
  }

  if (lng < -180 || lng > 180) {
    return {
      valid: false,
      error: 'Longitude must be between -180 and 180 degrees',
    };
  }

  return { valid: true };
};

// Distance calculation validation
export const validateDistance = (
  distance: number,
  maxDistance: number = 100 // 100 km
): { valid: boolean; error?: string } => {
  if (distance <= 0) {
    return {
      valid: false,
      error: 'Distance must be positive',
    };
  }

  if (distance > maxDistance) {
    return {
      valid: false,
      error: `Distance cannot exceed ${maxDistance} km`,
    };
  }

  return { valid: true };
};
