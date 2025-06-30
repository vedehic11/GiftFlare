import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Truck, Verified, Play } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isLiked, setIsLiked] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      {/* Product Image */}
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {product.instantDeliveryEligible && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center space-x-1">
              <Truck className="w-3 h-3" />
              <span>Instant Delivery</span>
            </span>
          )}
        </div>

        {/* Video Badge */}
        {product.videoUrl && (
          <div className="absolute top-3 right-3">
            <div className="bg-black/50 backdrop-blur-sm text-white p-2 rounded-full">
              <Play className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute bottom-3 right-3 bg-white/80 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
        >
          <Heart 
            className={`w-4 h-4 ${isLiked ? 'text-pink-500 fill-current' : 'text-gray-600'}`} 
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">
            {product.name}
          </h3>
          <span className="text-xl font-bold text-pink-600">
            ₹{product.price.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center space-x-2 mb-3">
          <span className="text-sm text-gray-600">{product.sellerName}</span>
          <Verified className="w-4 h-4 text-blue-500" />
          <span className="text-xs text-gray-500">• {product.city}</span>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-pink-50 text-pink-600 text-xs px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddToCart?.(product)}
          className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2 rounded-lg font-medium hover:shadow-md transition-shadow"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};