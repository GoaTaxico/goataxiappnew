interface DeepLinkConfig {
  scheme: string;
  host: string;
  paths: {
    [key: string]: {
      pattern: string;
      handler: (params: Record<string, string>) => void;
    };
  };
}

interface DeepLinkParams {
  [key: string]: string;
}

class DeepLinkingService {
  private config: DeepLinkConfig;
  private isInitialized: boolean = false;

  constructor(config: DeepLinkConfig) {
    this.config = config;
  }

  // Initialize deep linking
  initialize() {
    if (this.isInitialized) return;

    // Handle incoming deep links
    if (typeof window !== 'undefined') {
      // Handle URL changes
      window.addEventListener('popstate', this.handleUrlChange.bind(this));
      
      // Handle initial URL
      this.handleUrlChange();
      
      // Handle app launch from deep link (mobile)
      if ('standalone' in window.navigator || (window.navigator as any).standalone) {
        this.handleAppLaunch();
      }
    }

    this.isInitialized = true;
  }

  // Handle URL changes
  private handleUrlChange() {
    const url = window.location.href;
    this.processUrl(url);
  }

  // Handle app launch from deep link
  private handleAppLaunch() {
    // Check if app was launched from a deep link
    const referrer = document.referrer;
    if (referrer && referrer.includes(this.config.scheme)) {
      this.processUrl(referrer);
    }
  }

  // Process a URL and trigger appropriate handler
  private processUrl(url: string) {
    try {
      const urlObj = new URL(url);
      
      // Check if it's our deep link
      if (urlObj.protocol === `${this.config.scheme}:` || urlObj.host === this.config.host) {
        const path = urlObj.pathname;
        const params = this.parseQueryParams(urlObj.search);
        
        // Find matching path pattern
        for (const [key, route] of Object.entries(this.config.paths)) {
          if (this.matchesPattern(path, route.pattern)) {
            const extractedParams = this.extractParams(path, route.pattern);
            const allParams = { ...extractedParams, ...params };
            
            route.handler(allParams);
            return;
          }
        }
      }
    } catch (error) {
      console.error('Error processing deep link URL:', error);
    }
  }

  // Check if path matches pattern
  private matchesPattern(path: string, pattern: string): boolean {
    const pathSegments = path.split('/').filter(Boolean);
    const patternSegments = pattern.split('/').filter(Boolean);
    
    if (pathSegments.length !== patternSegments.length) {
      return false;
    }
    
    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      const pathSegment = pathSegments[i];
      
      if (patternSegment.startsWith(':')) {
        // Dynamic parameter
        continue;
      } else if (patternSegment !== pathSegment) {
        return false;
      }
    }
    
    return true;
  }

  // Extract parameters from path
  private extractParams(path: string, pattern: string): DeepLinkParams {
    const params: DeepLinkParams = {};
    const pathSegments = path.split('/').filter(Boolean);
    const patternSegments = pattern.split('/').filter(Boolean);
    
    for (let i = 0; i < patternSegments.length; i++) {
      const patternSegment = patternSegments[i];
      const pathSegment = pathSegments[i];
      
      if (patternSegment.startsWith(':')) {
        const paramName = patternSegment.slice(1);
        params[paramName] = pathSegment;
      }
    }
    
    return params;
  }

  // Parse query parameters
  private parseQueryParams(search: string): DeepLinkParams {
    const params: DeepLinkParams = {};
    const searchParams = new URLSearchParams(search);
    
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    
    return params;
  }

  // Create a deep link URL
  createDeepLink(path: string, params: DeepLinkParams = {}): string {
    let url = `${this.config.scheme}://${this.config.host}${path}`;
    
    if (Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(params)) {
        searchParams.append(key, value);
      }
      url += `?${searchParams.toString()}`;
    }
    
    return url;
  }

  // Navigate to a deep link
  navigate(path: string, params: DeepLinkParams = {}) {
    const url = this.createDeepLink(path, params);
    
    if (typeof window !== 'undefined') {
      // Update browser URL
      window.history.pushState({}, '', url);
      
      // Trigger handler
      this.processUrl(url);
    }
  }

  // Open deep link in external app
  openExternal(path: string, params: DeepLinkParams = {}) {
    const url = this.createDeepLink(path, params);
    
    if (typeof window !== 'undefined') {
      window.location.href = url;
    }
  }

  // Share deep link
  async share(path: string, params: DeepLinkParams = {}, title?: string, text?: string) {
    const url = this.createDeepLink(path, params);
    
    if (typeof window !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({
          title: title || 'Check this out',
          text: text || 'I found this interesting',
          url: url,
        });
      } catch (error) {
        console.error('Error sharing deep link:', error);
        // Fallback to copying to clipboard
        this.copyToClipboard(url);
      }
    } else {
      // Fallback to copying to clipboard
      this.copyToClipboard(url);
    }
  }

  // Copy URL to clipboard
  private async copyToClipboard(text: string) {
    try {
      if ('clipboard' in navigator) {
        await navigator.clipboard.writeText(text);
        // You can show a toast notification here
        console.log('Deep link copied to clipboard');
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        console.log('Deep link copied to clipboard');
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  }
}

// Goa Taxi specific deep linking configuration
const goaTaxiDeepLinkConfig: DeepLinkConfig = {
  scheme: 'goataxi',
  host: 'goataxi.app',
  paths: {
    booking: {
      pattern: '/booking/:id',
      handler: (params) => {
        // Navigate to booking details
        if (typeof window !== 'undefined') {
          window.location.href = `/dashboard/bookings/${params.id}`;
        }
      }
    },
    driver: {
      pattern: '/driver/:id',
      handler: (params) => {
        // Navigate to driver profile
        if (typeof window !== 'undefined') {
          window.location.href = `/driver/${params.id}`;
        }
      }
    },
    ride: {
      pattern: '/ride/:id',
      handler: (params) => {
        // Navigate to active ride
        if (typeof window !== 'undefined') {
          window.location.href = `/dashboard/rides/${params.id}`;
        }
      }
    },
    payment: {
      pattern: '/payment/:id',
      handler: (params) => {
        // Navigate to payment page
        if (typeof window !== 'undefined') {
          window.location.href = `/dashboard/payments/${params.id}`;
        }
      }
    },
    promo: {
      pattern: '/promo/:code',
      handler: (params) => {
        // Apply promo code
        if (typeof window !== 'undefined') {
          // Store promo code in localStorage for the booking flow
          localStorage.setItem('promoCode', params.code);
          window.location.href = '/dashboard/book';
        }
      }
    }
  }
};

// Create singleton instance
export const deepLinking = new DeepLinkingService(goaTaxiDeepLinkConfig);

// Hook for deep linking
export function useDeepLinking() {
  const navigate = (path: string, params: DeepLinkParams = {}) => {
    deepLinking.navigate(path, params);
  };

  const openExternal = (path: string, params: DeepLinkParams = {}) => {
    deepLinking.openExternal(path, params);
  };

  const share = (path: string, params: DeepLinkParams = {}, title?: string, text?: string) => {
    return deepLinking.share(path, params, title, text);
  };

  const createLink = (path: string, params: DeepLinkParams = {}) => {
    return deepLinking.createDeepLink(path, params);
  };

  return {
    navigate,
    openExternal,
    share,
    createLink,
  };
}

// Initialize deep linking on app start
if (typeof window !== 'undefined') {
  deepLinking.initialize();
}

// Export utility functions
export function createBookingLink(bookingId: string): string {
  return deepLinking.createDeepLink('/booking', { id: bookingId });
}

export function createDriverLink(driverId: string): string {
  return deepLinking.createDeepLink('/driver', { id: driverId });
}

export function createRideLink(rideId: string): string {
  return deepLinking.createDeepLink('/ride', { id: rideId });
}

export function createPaymentLink(paymentId: string): string {
  return deepLinking.createDeepLink('/payment', { id: paymentId });
}

export function createPromoLink(promoCode: string): string {
  return deepLinking.createDeepLink('/promo', { code: promoCode });
}
