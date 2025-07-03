import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface HeroVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  maker_name: string;
  location: string;
  order_index: number;
}

export const VideoCarousel: React.FC = () => {
  const [videos, setVideos] = useState<HeroVideo[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHeroVideos();
  }, []);

  const fetchHeroVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_videos')
        .select('*')
        .eq('is_active', true)
        .order('order_index');

      if (error) {
        console.error('Error fetching hero videos:', error);
        return;
      }

      if (data && data.length > 0) {
        setVideos(data);
      }
    } catch (error) {
      console.error('Error in fetchHeroVideos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (videos.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % videos.length);
      }, 6000);

      return () => clearInterval(interval);
    }
  }, [videos.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % videos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center text-amber-800">
          <h2 className="text-2xl font-bold mb-2">No videos available</h2>
          <p>Admin needs to add hero videos</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src={videos[currentSlide].video_url}
              alt={videos[currentSlide].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          {/* Content Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
              >
                Every Gift Has a{' '}
                <span className="text-amber-300">
                  Story
                </span>
              </motion.h1>
              
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-xl md:text-2xl lg:text-3xl mb-8 font-light"
              >
                Meet the Makers
              </motion.h2>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mb-8"
              >
                <p className="text-lg md:text-xl mb-2">{videos[currentSlide].description}</p>
                <p className="text-amber-200">
                  by {videos[currentSlide].maker_name} • {videos[currentSlide].location}
                </p>
              </motion.div>

              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToProducts}
                className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 inline-flex items-center space-x-2 shadow-lg"
              >
                <span>Explore Their Creations</span>
                <Play className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
      {videos.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
            {videos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};