'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import GoogleAuthButton from '@/components/ui/GoogleAuthButton';
import { 
  User, 
  Car, 
  Shield, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

export function Header() {
  const { user, profile, signOutMutation } = useAuth();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { mutate: signOut, isLoading: signOutLoading } = signOutMutation;

  const handleSignOut = () => {
    signOut(undefined, {
      onSuccess: () => {
        toast.success('Successfully signed out');
        router.push('/');
      },
      onError: () => {
        toast.error('Failed to sign out');
      },
    });
  };

  const handleDashboardClick = () => {
    if (!profile) return;
    
    if (profile.role === 'admin') {
      router.push('/admin');
    } else if (profile.role === 'driver') {
      router.push('/driver');
    } else {
      router.push('/dashboard');
    }
  };

  const handleBecomeDriver = () => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    if (profile?.role === 'driver') {
      router.push('/driver');
    } else {
      router.push('/driver/register');
    }
  };

  return (
    <motion.header
      className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => router.push('/')}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Goa Taxi App
              </h1>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Features
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Pricing
            </a>
            <a
              href="#drivers"
              className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              Drivers
            </a>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBecomeDriver}
                >
                  <Car className="w-4 h-4 mr-2" />
                  {profile?.role === 'driver' ? 'Driver Dashboard' : 'Become a Driver'}
                </Button>
                
                <div className="relative group">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDashboardClick}
                  >
                    {profile?.role === 'admin' ? (
                      <Shield className="w-4 h-4 mr-2" />
                    ) : profile?.role === 'driver' ? (
                      <Car className="w-4 h-4 mr-2" />
                    ) : (
                      <User className="w-4 h-4 mr-2" />
                    )}
                    {profile?.role === 'admin' ? 'Admin' : profile?.role === 'driver' ? 'Driver' : 'Dashboard'}
                  </Button>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <div className="py-2">
                      <div className="px-4 py-2 text-sm text-gray-600 border-b border-gray-100">
                        {profile?.full_name}
                      </div>
                      <button
                        onClick={handleDashboardClick}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Dashboard
                      </button>
                      <button
                        onClick={() => router.push('/profile')}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      >
                        Profile Settings
                      </button>
                      <button
                        onClick={handleSignOut}
                        disabled={signOutLoading}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <GoogleAuthButton
                  variant="login"
                  onSuccess={() => router.push('/dashboard')}
                />
                <Button
                  size="sm"
                  onClick={() => router.push('/auth/login')}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            className="md:hidden py-4 border-t border-gray-200"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <nav className="space-y-4">
              <a
                href="#features"
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#pricing"
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </a>
              <a
                href="#drivers"
                className="block text-gray-600 hover:text-gray-900 transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Drivers
              </a>
              
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleBecomeDriver();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      <Car className="w-4 h-4 mr-2" />
                      {profile?.role === 'driver' ? 'Driver Dashboard' : 'Become a Driver'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleDashboardClick();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      {profile?.role === 'admin' ? (
                        <Shield className="w-4 h-4 mr-2" />
                      ) : profile?.role === 'driver' ? (
                        <Car className="w-4 h-4 mr-2" />
                      ) : (
                        <User className="w-4 h-4 mr-2" />
                      )}
                      {profile?.role === 'admin' ? 'Admin' : profile?.role === 'driver' ? 'Driver' : 'Dashboard'}
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        router.push('/profile');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Profile Settings
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        handleSignOut();
                        setIsMobileMenuOpen(false);
                      }}
                      disabled={signOutLoading}
                      className="w-full text-red-600 hover:text-red-700"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <GoogleAuthButton
                      variant="login"
                      onSuccess={() => {
                        router.push('/dashboard');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        router.push('/auth/login');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full"
                    >
                      Sign In
                    </Button>
                  </div>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
