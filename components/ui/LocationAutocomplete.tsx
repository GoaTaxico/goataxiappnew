'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { logError } from '@/utils/logger';

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<any>(null);
  const placesService = useRef<any>(null);

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const _handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    if (!newValue.trim() || !autocompleteService.current) {
      setPredictions([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    setIsOpen(true);

    try {
      const request = {
        input: newValue,
        componentRestrictions: { country: 'in' }, // Restrict to India
        types: ['geocode', 'establishment'], // Include both addresses and places
      };

      autocompleteService.current.getPlacePredictions(
        request,
        (predictions: any, status: any) => {
          setIsLoading(false);
          if (status === 'OK' && predictions) {
            setPredictions(predictions);
          } else {
            setPredictions([]);
          }
        }
      );
    } catch (error) {
      logError('Error fetching predictions', error as Error, undefined, 'LocationAutocomplete');
      setIsLoading(false);
      setPredictions([]);
    }
  };

  const _handlePlaceSelect = (place: Place) => {
    setInputValue(place.description);
    onChange(place.description);
    setIsOpen(false);
    setPredictions([]);
  };

  const _handleInputFocus = () => {
    if (predictions.length > 0) {
      setIsOpen(true);
    }
  };

  const _handleInputBlur = () => {
    // Delay closing to allow for clicks on predictions
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const _handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={_handleInputChange}
          onFocus={_handleInputFocus}
          onBlur={_handleInputBlur}
          onKeyDown={_handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`pl-10 pr-10 ${className}`}
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 animate-spin" />
        )}
      </div>

      <AnimatePresence>
        {isOpen && predictions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {predictions.map((place) => (
              <motion.button
                key={place.place_id}
                onClick={() => _handlePlaceSelect(place)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none transition-colors duration-150"
                whileHover={{ backgroundColor: '#f9fafb' }}
                whileTap={{ backgroundColor: '#f3f4f6' }}
              >
                <div className="font-medium text-gray-900">
                  {place.structured_formatting.main_text}
                </div>
                <div className="text-sm text-gray-500">
                  {place.structured_formatting.secondary_text}
                </div>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {isOpen && predictions.length === 0 && !isLoading && inputValue.trim() && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
        >
          <div className="text-center text-gray-500">
            No locations found. Try a different search term.
          </div>
        </motion.div>
      )}
    </div>
  );
}
