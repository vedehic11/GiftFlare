import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export const CartIcon: React.FC = () => {
  const { getTotalItems, setIsCartOpen } = useCart();
  const itemCount = getTotalItems();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsCartOpen(true)}
      className="relative p-2 text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-xl transition-all"
    >
      <ShoppingBag className="w-6 h-6" />
      {itemCount > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
        >
          {itemCount > 99 ? '99+' : itemCount}
        </motion.div>
      )}
    </motion.button>
  );
};