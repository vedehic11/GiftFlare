import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Verified, Play, Star, MapPin } from 'lucide-react';
import { Product } from '../types';
import { InstantDeliveryBadge, DeliveryTimeEstimate } from './InstantDeliveryBadge';

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
      whileHover={{ y: -8 }}
      className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden group border border-amber-100"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Instant Delivery Badge */}
        <div className="absolute top-4 left-4">
          <InstantDeliveryBadge product={product} />
        </div>

        {/* Video Badge */}
        {product.videoUrl && (
          <div className="absolute top-4 right-4">
            <div className="bg-black/60 backdrop-blur-sm text-white p-2.5 rounded-full shadow-lg">
              <Play className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Like Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsLiked(!isLiked)}
          className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg"
        >
          <Heart 
            className={`w-5 h-5 transition-colors ${
              isLiked ? 'text-amber-600 fill-current' : 'text-amber-700'
            }`} 
          />
        </motion.button>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-amber-900 text-lg line-clamp-2 leading-tight">
            {product.name}
          </h3>
          <span className="text-2xl font-bold text-amber-600 ml-2">
            ₹{product.price.toLocaleString()}
          </span>
        </div>

        {/* Seller Info */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center space-x-1">
            <span className="text-sm font-medium text-amber-800">{product.sellerName}</span>
            <Verified className="w-4 h-4 text-blue-500" />
          </div>
          <span className="text-amber-300">•</span>
          <div className="flex items-center space-x-1">
            <MapPin className="w-3 h-3 text-amber-500" />
            <span className="text-xs text-amber-600">{product.city}</span>
          </div>
        </div>

        <p className="text-amber-700 text-sm mb-4 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Delivery Time */}
        <div className="mb-4">
          <DeliveryTimeEstimate product={product} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {product.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="bg-amber-50 text-amber-700 text-xs px-3 py-1 rounded-full font-medium border border-amber-200"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Rating (Mock) */}
        <div className="flex items-center space-x-2 mb-5">
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 4 ? 'text-yellow-400 fill-current' : 'text-amber-300'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-amber-700">(4.8)</span>
          <span className="text-xs text-amber-500">• 24 reviews</span>
        </div>

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddToCart?.(product)}
          className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg"
        >
          Add to Cart
        </motion.button>
      </div>
    </motion.div>
  );
};