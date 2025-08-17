import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { InstallPrompt } from '@/components/pwa/InstallPrompt'
import { ClientOnly } from '@/components/ui/ClientOnly'

const _inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Goa Taxi App - Book Your Ride in Goa',
  description: 'Book reliable taxi services in Goa. Connect directly with verified drivers for the best rates. No booking fees, direct payment.',
  keywords: 'Goa taxi, taxi booking, Goa travel, taxi service, ride booking, Goa transportation',
  authors: [{ name: 'Goa Taxi App' }],
  creator: 'Goa Taxi App',
  publisher: 'Goa Taxi App',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://goataxi.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Goa Taxi App - Book Your Ride in Goa',
    description: 'Book reliable taxi services in Goa. Connect directly with verified drivers for the best rates.',
    url: 'https://goataxi.app',
    siteName: 'Goa Taxi App',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Goa Taxi App',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goa Taxi App - Book Your Ride in Goa',
    description: 'Book reliable taxi services in Goa. Connect directly with verified drivers for the best rates.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://maps.googleapis.com" />
        <link rel="preconnect" href="https://checkout.razorpay.com" />
        
        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Goa Taxi App",
              "description": "Reliable taxi booking service in Goa",
              "url": "https://goataxi.app",
              "telephone": "+91-XXXXXXXXXX",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Goa",
                "addressRegion": "Goa",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 15.2993,
                "longitude": 74.1240
              },
              "openingHours": "Mo-Su 00:00-23:59",
              "priceRange": "₹₹",
              "serviceType": "Taxi Service",
              "areaServed": "Goa, India"
            })
          }}
        />
      </head>
      <body className="font-sans">
        <QueryProvider>
          <AuthProvider>
            <div className="min-h-screen bg-gray-50">
              {children}
            </div>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#22c55e',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 5000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <ClientOnly>
              <InstallPrompt />
            </ClientOnly>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
