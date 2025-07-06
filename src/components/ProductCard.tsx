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
      className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group border border-slate-200"
      onHoverStart={() => setShowQuickAdd(true)}
      onHoverEnd={() => setShowQuickAdd(false)}
    >
      {/* Product Image - Mobile Optimized */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Instant Delivery Badge */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4">
          <InstantDeliveryBadge product={product} />
        </div>

        {/* Video Badge */}
        {product.videoUrl && (
          <div className="absolute top-3 right-3 md:top-4 md:right-4">
            <div className="bg-black/60 backdrop-blur-sm text-white p-2 md:p-2.5 rounded-full shadow-lg">
              <Play className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          </div>
        )}

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
          className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-white/90 backdrop-blur-sm p-2.5 md:p-3 rounded-full hover:bg-white transition-all shadow-lg"
        >
          <Heart 
            className={`w-4 h-4 md:w-5 md:h-5 transition-colors ${
              isLiked ? 'text-rose-600 fill-current' : 'text-slate-700'
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
              className="absolute bottom-3 left-3 md:bottom-4 md:left-4 hidden md:flex space-x-2"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleQuickAdd}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm font-medium transition-all shadow-lg flex items-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Add to Cart</span>
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGiftAdd}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 md:px-5 md:py-2.5 rounded-full text-sm font-medium transition-all shadow-lg flex items-center space-x-2"
              >
                <Gift className="w-4 h-4" />
                <span className="hidden sm:inline">Gift</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Product Info - Mobile Optimized */}
      <div className="p-4 md:p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-base md:text-lg line-clamp-2 leading-tight flex-1 mr-2">
            {product.name}
          </h3>
          <span className="text-lg md:text-xl font-bold text-blue-600 whitespace-nowrap">
            ₹{product.price.toLocaleString()}
          </span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-slate-800">{product.sellerName}</span>
            <Verified className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            <span className="text-xs text-slate-600">{product.city}</span>
          </div>
        </div>

        <p className="text-slate-600 text-sm mb-3 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Delivery Time */}
        <div className="mb-3">
          <DeliveryTimeEstimate product={product} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-slate-100 text-slate-700 text-xs px-3 py-1 rounded-full font-medium border border-slate-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Rating (Mock) */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 4 ? 'text-yellow-400 fill-current' : 'text-slate-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-slate-700">(4.8)</span>
          <span className="text-xs text-slate-500">• 24 reviews</span>
        </div>

        {/* Action Buttons - Mobile Optimized */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleQuickAdd}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 md:py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="text-sm md:text-base">Add to Cart</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGiftAdd}
            className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 md:px-5 py-3 md:py-3.5 rounded-xl transition-all duration-300 shadow-lg flex items-center justify-center"
          >
            <Gift className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};