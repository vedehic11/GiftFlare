import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface VideoSlide {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  makerName: string;
  location: string;
}

const mockVideos: VideoSlide[] = [
  {
    id: '1',
    title: 'Handcrafted Pottery',
    description: 'Watch Priya create beautiful ceramic pieces in her Mumbai studio',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    makerName: 'Priya Sharma',
    location: 'Mumbai'
  },
  {
    id: '2',
    title: 'Artisan Candles',
    description: 'See how Ravi crafts aromatic soy candles with natural ingredients',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    makerName: 'Ravi Kumar',
    location: 'Mumbai'
  },
  {
    id: '3',
    title: 'Handwoven Textiles',
    description: 'Discover Meera\'s traditional weaving techniques',
    videoUrl: 'https://player.vimeo.com/video/76979871',
    makerName: 'Meera Patel',
    location: 'Mumbai'
  }
];

export const VideoCarousel: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRefs = useRef<(HTMLIFrameElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPlaying) {
        setCurrentSlide((prev) => (prev + 1) % mockVideos.length);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % mockVideos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + mockVideos.length) % mockVideos.length);
  };

  const scrollToProducts = () => {
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative h-screen bg-gradient-to-r from-pink-900 via-rose-800 to-pink-900 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          {/* Background Video */}
          <div className="absolute inset-0 bg-black/40 z-10" />
          <iframe
            ref={el => videoRefs.current[currentSlide] = el}
            src={`${mockVideos[currentSlide].videoUrl}?autoplay=1&loop=1&muted=1&background=1`}
            className="w-full h-full object-cover"
            allow="autoplay; encrypted-media"
            style={{ pointerEvents: 'none' }}
          />

          {/* Content Overlay */}
          <div className="absolute inset-0 z-20 flex items-center justify-center">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
              >
                Every Gift Has a{' '}
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  Story
                </span>
              </motion.h1>
              
              <motion.h2
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-2xl md:text-3xl mb-8 font-light"
              >
                Meet the Makers
              </motion.h2>

              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="mb-8"
              >
                <p className="text-xl mb-2">{mockVideos[currentSlide].description}</p>
                <p className="text-pink-200">
                  by {mockVideos[currentSlide].makerName} • {mockVideos[currentSlide].location}
                </p>
              </motion.div>

              <motion.button
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={scrollToProducts}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl transition-all duration-300 inline-flex items-center space-x-2"
              >
                <span>Explore Their Creations</span>
                <Play className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Controls */}
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
        {mockVideos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};