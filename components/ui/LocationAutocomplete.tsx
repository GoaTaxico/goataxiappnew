'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface LocationAutocompleteProps {
  value: string;
  onChange: (location: { name: string; lat: number; lng: number }) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

interface Place {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

export function LocationAutocomplete({
  value,
  onChange,
  placeholder = 'Enter location',
  className = '',
  disabled = false,
}: LocationAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [predictions, setPredictions] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [isHydrated, setIsHydrated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);

  // Mark as hydrated after first render
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    // Initialize Google Places API
    const initGooglePlaces = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
        if (inputRef.current) {
          placesService.current = new window.google.maps.places.PlacesService(inputRef.current);
        }
      }
    };

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initGooglePlaces;
      document.head.appendChild(script);
    } else {
      initGooglePlaces();
    }

    return () => {
      // Cleanup if needed
    };
  }, [isHydrated]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const _handleInputChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setInputValue(query);
    setIsOpen(true);

    if (!query.trim() || !autocompleteService.current) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);

    try {
      const response = await new Promise<any>((resolve, reject) => {
        autocompleteService.current.getPlacePredictions(
          {
            input: query,
            types: ['establishment', 'geocode'],
          },
          (predictions: any[], status: any) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              resolve(predictions);
            } else {
              reject(new Error(`Places API error: ${status}`));
            }
          }
        );
      });

      setPredictions(response);
    } catch (error) {
      console.error('Error fetching predictions:', error);
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const _handlePlaceSelect = useCallback(async (place: Place) => {
    if (!placesService.current) return;

    try {
      const details = await new Promise<any>((resolve, reject) => {
        placesService.current.getDetails(
          {
            placeId: place.place_id,
            fields: ['name', 'geometry', 'formatted_address'],
          },
          (result: any, status: any) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              resolve(result);
            } else {
              reject(new Error(`Places API error: ${status}`));
            }
          }
        );
      });

      const location = {
        name: details.name || place.structured_formatting.main_text,
        lat: details.geometry.location.lat(),
        lng: details.geometry.location.lng(),
      };

      onChange(location);
      setInputValue(location.name);
      setIsOpen(false);
      setPredictions([]);
    } catch (error) {
      console.error('Error getting place details:', error);
    }
  }, [onChange]);

  const _handleClear = useCallback(() => {
    setInputValue('');
    setPredictions([]);
    setIsOpen(false);
    onChange({ name: '', lat: 0, lng: 0 });
  }, [onChange]);

  const _handleFocus = useCallback(() => {
    if (inputValue.trim() && predictions.length > 0) {
      setIsOpen(true);
    }
  }, [inputValue, predictions]);

  const _handleBlur = useCallback(() => {
    // Delay closing to allow for clicks on predictions
    setTimeout(() => setIsOpen(false), 200);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={_handleInputChange}
          onFocus={_handleFocus}
          onBlur={_handleBlur}
          placeholder={placeholder}
          disabled={disabled || !isHydrated}
          className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        {inputValue && (
          <button
            onClick={_handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (predictions.length > 0 || isLoading) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {isLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">Searching...</span>
              </div>
            ) : (
              <div className="py-1">
                {predictions.map((prediction) => (
                  <button
                    key={prediction.place_id}
                    onClick={() => _handlePlaceSelect(prediction)}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <div className="flex items-center space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {prediction.structured_formatting.main_text}
                        </p>
                        {prediction.structured_formatting.secondary_text && (
                          <p className="text-sm text-gray-500 truncate">
                            {prediction.structured_formatting.secondary_text}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
