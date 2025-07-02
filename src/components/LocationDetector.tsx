import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, X, Check } from 'lucide-react';
import { useLocation } from '../contexts/LocationContext';

export const LocationDetector: React.FC = () => {
  const { 
    userCity, 
    isLocationLoading, 
    requestLocation, 
    setUserCity, 
    locationError 
  } = useLocation();
  const [showLocationModal, setShowLocationModal] = useState(!userCity);
  const [selectedCity, setSelectedCity] = useState('');

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];

  const handleManualSelection = () => {
    if (selectedCity) {
      setUserCity(selectedCity);
      setShowLocationModal(false);
    }
  };

  const handleAutoDetect = async () => {
    await requestLocation();
    if (!locationError) {
      setShowLocationModal(false);
    }
  };

  if (!showLocationModal && userCity) {
    return (
      <div className="fixed bottom-4 right-4 z-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 p-3 flex items-center space-x-2"
        >
          <MapPin className="w-4 h-4 text-rose-600" />
          <span className="text-sm font-medium text-gray-700">{userCity}</span>
          <button
            onClick={() => setShowLocationModal(true)}
            className="text-xs text-rose-600 hover:text-rose-700 font-medium"
          >
            Change
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <AnimatePresence>
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-8 w-full max-w-md"
          >
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-rose-500 to-pink-500 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                What's your location?
              </h2>
              <p className="text-gray-600">
                We'll show you instant delivery options in your area
              </p>
            </div>

            {locationError && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {locationError}
              </div>
            )}

            {/* Auto-detect button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAutoDetect}
              disabled={isLocationLoading}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 mb-4 flex items-center justify-center space-x-2"
            >
              {isLocationLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Detecting...</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>Auto-detect my location</span>
                </>
              )}
            </motion.button>

            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or choose manually</span>
              </div>
            </div>

            {/* Manual selection */}
            <div className="space-y-3 mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Select your city
              </label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              >
                <option value="">Choose a city</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="flex space-x-3">
              {userCity && (
                <button
                  onClick={() => setShowLocationModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                onClick={handleManualSelection}
                disabled={!selectedCity}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};