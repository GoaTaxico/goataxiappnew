import { Suspense } from 'react';
import { HeroSection } from '@/components/sections/HeroSection';
import { BookingForm } from '@/components/forms/BookingForm';
import { DriverShowcase } from '@/components/sections/DriverShowcase';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { PricingSection } from '@/components/sections/PricingSection';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { MobileApp } from '@/components/MobileApp';

export default function HomePage() {
  return (
    <>
      {/* Mobile App Experience */}
      <MobileApp />
      
      {/* Desktop Experience */}
      <div className="hidden md:block min-h-screen">
        {/* Header */}
        <Header />
        
        {/* Hero Section with Booking Form */}
        <HeroSection />
        
        {/* Main Booking Form */}
        <section id="booking" className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Book Your Ride in Goa
                </h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                  Choose your vehicle type, set pickup and drop locations, and connect directly with verified drivers. 
                  No booking fees, negotiate your own price!
                </p>
              </div>
              
              <Suspense fallback={<LoadingSpinner />}>
                <BookingForm />
              </Suspense>
            </div>
          </div>
        </section>

        {/* Driver Showcase */}
        <section id="drivers" className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Our Top Drivers
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Meet our verified and highly-rated drivers who are ready to serve you across Goa
              </p>
            </div>
            
            <Suspense fallback={<LoadingSpinner />}>
              <DriverShowcase />
            </Suspense>
          </div>
        </section>

        {/* Features Section */}
        <section id="features">
          <FeaturesSection />
        </section>

        {/* Pricing Section */}
        <section id="pricing">
          <PricingSection />
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
}
