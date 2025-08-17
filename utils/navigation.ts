interface Coordinates {
  lat: number;
  lng: number;
}

interface NavigationOptions {
  name?: string;
  address?: string;
}

// Open navigation in Google Maps
export function openGoogleMaps(coordinates: Coordinates, options: NavigationOptions = {}) {
  const { lat, lng } = coordinates;
  const { name = 'Destination', address = '' } = options;
  
  const query = encodeURIComponent(address || `${lat},${lng}`);
  const url = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
  
  window.open(url, '_blank');
}

// Open navigation in Apple Maps (iOS)
export function openAppleMaps(coordinates: Coordinates, options: NavigationOptions = {}) {
  const { lat, lng } = coordinates;
  const { name = 'Destination', address = '' } = options;
  
  const query = encodeURIComponent(address || `${lat},${lng}`);
  const url = `http://maps.apple.com/?daddr=${query}`;
  
  window.open(url, '_blank');
}

// Open navigation in Waze
export function openWaze(coordinates: Coordinates, options: NavigationOptions = {}) {
  const { lat, lng } = coordinates;
  const { name = 'Destination' } = options;
  
  const url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
  
  window.open(url, '_blank');
}

// Smart navigation - detects platform and opens appropriate app
export function openNavigation(coordinates: Coordinates, options: NavigationOptions = {}) {
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Check if it's iOS
  if (/iphone|ipad|ipod/.test(userAgent)) {
    openAppleMaps(coordinates, options);
  } else {
    // Default to Google Maps for other platforms
    openGoogleMaps(coordinates, options);
  }
}

// Open navigation with multiple options
export function openNavigationWithOptions(coordinates: Coordinates, options: NavigationOptions = {}) {
  const { lat, lng } = coordinates;
  const { name = 'Destination', address = '' } = options;
  
  // Create a modal or dropdown with navigation options
  const navigationOptions = [
    {
      name: 'Google Maps',
      icon: '🗺️',
      action: () => openGoogleMaps(coordinates, options)
    },
    {
      name: 'Waze',
      icon: '🚗',
      action: () => openWaze(coordinates, options)
    }
  ];
  
  // For iOS, add Apple Maps option
  if (/iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())) {
    navigationOptions.unshift({
      name: 'Apple Maps',
      icon: '🍎',
      action: () => openAppleMaps(coordinates, options)
    });
  }
  
  return navigationOptions;
}

// Get current location and open navigation to destination
export function navigateToDestination(destinationCoordinates: Coordinates, options: NavigationOptions = {}) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        
        // Open navigation from current location to destination
        openNavigation(destinationCoordinates, options);
      },
      (error) => {
        console.error('Error getting current location:', error);
        // Fallback to just opening navigation to destination
        openNavigation(destinationCoordinates, options);
      }
    );
  } else {
    // Fallback if geolocation is not supported
    openNavigation(destinationCoordinates, options);
  }
}

// Share location via various methods
export function shareLocation(coordinates: Coordinates, options: NavigationOptions = {}) {
  const { lat, lng } = coordinates;
  const { name = 'Location', address = '' } = options;
  
  const locationText = address || `${lat},${lng}`;
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
  
  const shareData = {
    title: name,
    text: `Check out this location: ${locationText}`,
    url: googleMapsUrl
  };
  
  if ('share' in navigator) {
    navigator.share(shareData).catch((error) => {
      console.error('Error sharing location:', error);
      // Fallback to copying to clipboard
      copyToClipboard(googleMapsUrl);
    });
  } else {
    // Fallback to copying to clipboard
    copyToClipboard(googleMapsUrl);
  }
}

// Copy text to clipboard
function copyToClipboard(text: string) {
  if ('clipboard' in navigator) {
    navigator.clipboard.writeText(text).then(() => {
      // You can show a toast notification here
      console.log('Location copied to clipboard');
    }).catch((error) => {
      console.error('Error copying to clipboard:', error);
    });
  } else {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    console.log('Location copied to clipboard');
  }
}

// Get distance between two coordinates
export function getDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
  const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Format distance for display
export function formatDistance(distance: number): string {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  } else {
    return `${distance.toFixed(1)}km`;
  }
}
