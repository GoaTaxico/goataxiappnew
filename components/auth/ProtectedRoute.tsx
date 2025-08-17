'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('user' | 'driver' | 'admin')[];
  redirectTo?: string;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  allowedRoles = ['user', 'driver', 'admin'],
  redirectTo = '/auth/login',
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, profile, userLoading, profileLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // Wait for auth data to load
    if (userLoading || profileLoading) {
      return;
    }

    // Check if user is authenticated
    if (!user || !profile) {
      setIsAuthorized(false);
      router.push(redirectTo);
      return;
    }

    // Check if user has required role
    if (!allowedRoles.includes(profile.role)) {
      setIsAuthorized(false);
      // Redirect based on user's actual role
      if (profile.role === 'admin') {
        router.push('/admin');
      } else if (profile.role === 'driver') {
        router.push('/driver');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    setIsAuthorized(true);
  }, [user, profile, userLoading, profileLoading, allowedRoles, redirectTo, router]);

  // Show loading state while checking auth
  if (userLoading || profileLoading || isAuthorized === null) {
    return (
      fallback || (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
            <p className="text-gray-600">Loading...</p>
          </motion.div>
        </div>
      )
    );
  }

  // Show children if authorized
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Show nothing while redirecting
  return null;
}

// Convenience components for specific roles
export function UserRoute({ children, ...props }: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <ProtectedRoute allowedRoles={['user']} {...props}>
      {children}
    </ProtectedRoute>
  );
}

export function DriverRoute({ children, ...props }: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <ProtectedRoute allowedRoles={['driver']} {...props}>
      {children}
    </ProtectedRoute>
  );
}

export function AdminRoute({ children, ...props }: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <ProtectedRoute allowedRoles={['admin']} {...props}>
      {children}
    </ProtectedRoute>
  );
}

export function AuthenticatedRoute({ children, ...props }: Omit<ProtectedRouteProps, 'allowedRoles'>) {
  return (
    <ProtectedRoute allowedRoles={['user', 'driver', 'admin']} {...props}>
      {children}
    </ProtectedRoute>
  );
}
