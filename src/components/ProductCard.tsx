import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Verified, Play, Star, MapPin, ShoppingBag, Gift, Package } from 'lucide-react';
import { Product } from '../types';
import { InstantDeliveryBadge, DeliveryTimeEstimate } from './InstantDeliveryBadge';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const { addToCart } = useCart();

  const handleQuickAdd = () => {
    addToCart(product);
  };

  const handleGiftAdd = () => {
    addToCart(product, { giftPackaging: true });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl md:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group border border-amber-100"
      onHoverStart={() => setShowQuickAdd(true)}
      onHoverEnd={() => setShowQuickAdd(false)}
    >
      {/* Product Image - Mobile Optimized */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Instant Delivery Badge */}
        <div className="absolute top-2 left-2 md:top-3 md:left-3">
          <InstantDeliveryBadge product={product} />
        </div>

        {/* Video Badge */}
        {product.videoUrl && (
          <div className="absolute top-2 right-2 md:top-3 md:right-3">
            <div className="bg-black/60 backdrop-blur-sm text-white p-1.5 md:p-2 rounded-full shadow-lg">
              <Play className="w-3 h-3 md:w-4 md:h-4" />
            </div>
          </div>
        )}

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
          className="absolute bottom-2 right-2 md:bottom-3 md:right-3 bg-white/90 backdrop-blur-sm p-2 md:p-2.5 rounded-full hover:bg-white transition-all shadow-lg"
        >
          <Heart 
            className={`w-3 h-3 md:w-4 md:h-4 transition-colors ${
              isLiked ? 'text-amber-600 fill-current' : 'text-amber-700'
            }`} 
          />
        </motion.button>

        {/* Quick Add Buttons - Hidden on mobile, shown on hover for desktop */}
        <AnimatePresence>
          {showQuickAdd && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="absolute bottom-2 left-2 md:bottom-3 md:left-3 hidden md:flex space-x-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuickAdd}
                className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all shadow-lg flex items-center space-x-1 md:space-x-2"
              >
                <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Add to Cart</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGiftAdd}
                className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-all shadow-lg flex items-center space-x-1 md:space-x-2"
              >
                <Gift className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">Gift</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info - Mobile Optimized */}
      <div className="p-3 md:p-4 lg:p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-amber-900 text-sm md:text-base lg:text-lg line-clamp-2 leading-tight flex-1 mr-2">
            {product.name}
          </h3>
          <span className="text-base md:text-lg lg:text-xl font-bold text-amber-600 whitespace-nowrap">
            ₹{product.price.toLocaleString()}
          </span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center space-x-1 md:space-x-2 mb-2 md:mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-xs md:text-sm font-medium text-amber-800">{product.sellerName}</span>
            <Verified className="w-3 h-3 md:w-4 md:h-4 text-blue-500" />
          </div>
          <span className="text-amber-300">•</span>
          <div className="flex items-center space-x-1">
            <MapPin className="w-2.5 h-2.5 md:w-3 md:h-3 text-amber-500" />
            <span className="text-xs text-amber-600">{product.city}</span>
          </div>
        </div>

        <p className="text-amber-700 text-xs md:text-sm mb-2 md:mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Delivery Time */}
        <div className="mb-2 md:mb-3">
          <DeliveryTimeEstimate product={product} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 md:gap-2 mb-3 md:mb-4">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-amber-50 text-amber-700 text-xs px-2 py-1 md:px-3 md:py-1 rounded-full font-medium border border-amber-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Rating (Mock) */}
        <div className="flex items-center space-x-1 md:space-x-2 mb-3 md:mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 md:w-4 md:h-4 ${
                  i < 4 ? 'text-yellow-400 fill-current' : 'text-amber-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs md:text-sm text-amber-700">(4.8)</span>
          <span className="text-xs text-amber-500">• 24 reviews</span>
        </div>

        {/* Action Buttons - Mobile Optimized */}
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleQuickAdd}
            className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-2 md:py-2.5 lg:py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-3 h-3 md:w-4 md:h-4" />
            <span className="text-xs md:text-sm lg:text-base">Add to Cart</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGiftAdd}
            className="bg-orange-600 hover:bg-orange-700 text-white px-2 md:px-3 lg:px-4 py-2 md:py-2.5 lg:py-3 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center"
          >
            <Gift className="w-3 h-3 md:w-4 md:h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};