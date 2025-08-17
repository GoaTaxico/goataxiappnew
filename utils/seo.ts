// SEO optimization utilities

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterSite?: string;
  twitterCreator?: string;
  robots?: string;
  canonical?: string;
}

// Default SEO configuration
export const defaultSEO: SEOConfig = {
  title: 'Goa Taxi App - Book Your Ride in Goa',
  description: 'Book reliable taxi services in Goa with real-time tracking, secure payments, and professional drivers. Available 24/7 for airport transfers, sightseeing, and local travel.',
  keywords: ['goa taxi', 'taxi booking', 'airport transfer', 'goa travel', 'car rental', 'driver booking'],
  image: '/images/og-image.jpg',
  url: 'https://goataxiapp.com',
  type: 'website',
  twitterCard: 'summary_large_image',
  robots: 'index, follow',
};

// Generate meta tags for Next.js Head component
export function generateSEOTags(config: SEOConfig): Record<string, string> {
  const tags: Record<string, string> = {};

  // Basic meta tags
  tags['title'] = config.title;
  tags['description'] = config.description;
  tags['keywords'] = config.keywords?.join(', ') || '';
  tags['robots'] = config.robots || 'index, follow';
  tags['canonical'] = config.canonical || config.url || '';

  // Open Graph tags
  tags['og:title'] = config.title;
  tags['og:description'] = config.description;
  tags['og:type'] = config.type || 'website';
  tags['og:url'] = config.url || '';
  tags['og:image'] = config.image || '';
  tags['og:site_name'] = 'Goa Taxi App';
  tags['og:locale'] = 'en_US';

  if (config.author) {
    tags['og:author'] = config.author;
  }

  if (config.publishedTime) {
    tags['og:published_time'] = config.publishedTime;
  }

  if (config.modifiedTime) {
    tags['og:modified_time'] = config.modifiedTime;
  }

  if (config.section) {
    tags['og:section'] = config.section;
  }

  if (config.tags) {
    tags['og:tag'] = config.tags.join(', ');
  }

  // Twitter Card tags
  tags['twitter:card'] = config.twitterCard || 'summary_large_image';
  tags['twitter:title'] = config.title;
  tags['twitter:description'] = config.description;
  tags['twitter:image'] = config.image || '';

  if (config.twitterSite) {
    tags['twitter:site'] = config.twitterSite;
  }

  if (config.twitterCreator) {
    tags['twitter:creator'] = config.twitterCreator;
  }

  return tags;
}

// Generate structured data (JSON-LD)
export function generateStructuredData(config: SEOConfig, type: 'website' | 'organization' | 'service' = 'website') {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    name: config.title,
    description: config.description,
    url: config.url,
  };

  switch (type) {
    case 'organization':
      return {
        ...baseData,
        '@type': 'Organization',
        name: 'Goa Taxi App',
        logo: {
          '@type': 'ImageObject',
          url: '/images/logo.png',
        },
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-XXXXXXXXXX',
          contactType: 'customer service',
          availableLanguage: 'English',
        },
        sameAs: [
          'https://facebook.com/goataxiapp',
          'https://twitter.com/goataxiapp',
          'https://instagram.com/goataxiapp',
        ],
      };

    case 'service':
      return {
        ...baseData,
        '@type': 'Service',
        name: 'Taxi Booking Service in Goa',
        provider: {
          '@type': 'Organization',
          name: 'Goa Taxi App',
        },
        areaServed: {
          '@type': 'Place',
          name: 'Goa, India',
        },
        serviceType: 'Taxi Booking',
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: config.url,
        },
      };

    default:
      return baseData;
  }
}

// Page-specific SEO configurations
export const pageSEO = {
  home: {
    title: 'Goa Taxi App - Book Your Ride in Goa',
    description: 'Book reliable taxi services in Goa with real-time tracking, secure payments, and professional drivers. Available 24/7 for airport transfers, sightseeing, and local travel.',
    keywords: ['goa taxi', 'taxi booking', 'airport transfer', 'goa travel', 'car rental', 'driver booking'],
    type: 'website' as const,
  },

  booking: {
    title: 'Book Your Taxi - Goa Taxi App',
    description: 'Book your taxi ride in Goa with our easy-to-use booking system. Choose from various vehicle types, track your ride in real-time, and pay securely.',
    keywords: ['book taxi', 'goa taxi booking', 'online taxi booking', 'ride booking'],
    type: 'website' as const,
  },

  driver: {
    title: 'Become a Driver - Goa Taxi App',
    description: 'Join our network of professional drivers in Goa. Earn money by providing reliable taxi services to customers. Flexible hours and competitive earnings.',
    keywords: ['become driver', 'driver registration', 'driver jobs', 'taxi driver', 'goa driver'],
    type: 'website' as const,
  },

  admin: {
    title: 'Admin Dashboard - Goa Taxi App',
    description: 'Manage your taxi business with our comprehensive admin dashboard. Monitor bookings, manage drivers, and track revenue.',
    keywords: ['admin dashboard', 'business management', 'driver management', 'booking management'],
    type: 'website' as const,
  },

  about: {
    title: 'About Us - Goa Taxi App',
    description: 'Learn about Goa Taxi App, our mission to provide reliable taxi services in Goa, and our commitment to customer satisfaction.',
    keywords: ['about us', 'goa taxi app', 'company information', 'mission'],
    type: 'website' as const,
  },

  contact: {
    title: 'Contact Us - Goa Taxi App',
    description: 'Get in touch with Goa Taxi App for support, feedback, or business inquiries. We\'re here to help you with all your taxi booking needs.',
    keywords: ['contact us', 'support', 'customer service', 'help'],
    type: 'website' as const,
  },

  privacy: {
    title: 'Privacy Policy - Goa Taxi App',
    description: 'Read our privacy policy to understand how we collect, use, and protect your personal information when you use our taxi booking service.',
    keywords: ['privacy policy', 'data protection', 'personal information'],
    type: 'website' as const,
  },

  terms: {
    title: 'Terms of Service - Goa Taxi App',
    description: 'Read our terms of service to understand the rules and regulations governing the use of our taxi booking platform.',
    keywords: ['terms of service', 'terms and conditions', 'user agreement'],
    type: 'website' as const,
  },
};

// Generate sitemap data
export function generateSitemapData(): Array<{
  url: string;
  lastModified: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://goataxiapp.com';
  const currentDate = new Date().toISOString();

  return [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/booking`,
      lastModified: currentDate,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/driver`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/driver/register`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];
}

// Generate robots.txt content
export function generateRobotsTxt(): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://goataxiapp.com';
  
  return `User-agent: *
Allow: /

# Disallow admin and private routes
Disallow: /admin/
Disallow: /api/
Disallow: /auth/
Disallow: /dashboard/
Disallow: /driver/

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1`;
}

// Generate manifest.json for PWA
export function generateManifest(): Record<string, any> {
  return {
    name: 'Goa Taxi App',
    short_name: 'Goa Taxi',
    description: 'Book reliable taxi services in Goa',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    categories: ['travel', 'transportation'],
    lang: 'en',
    dir: 'ltr',
  };
}

// Performance monitoring for Core Web Vitals
export function trackCoreWebVitals() {
  if (typeof window === 'undefined') return;

  // Track Largest Contentful Paint (LCP)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.entryType === 'largest-contentful-paint') {
        console.log('LCP:', entry.startTime);
        // Send to analytics service
      }
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // Track First Input Delay (FID)
  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (entry.entryType === 'first-input') {
        const fidEntry = entry as PerformanceEventTiming;
        console.log('FID:', fidEntry.processingStart - fidEntry.startTime);
        // Send to analytics service
      }
    }
  }).observe({ entryTypes: ['first-input'] });

  // Track Cumulative Layout Shift (CLS)
  new PerformanceObserver((entryList) => {
    let clsValue = 0;
    for (const entry of entryList.getEntries()) {
      if (entry.entryType === 'layout-shift' && !(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
    console.log('CLS:', clsValue);
    // Send to analytics service
  }).observe({ entryTypes: ['layout-shift'] });
}
