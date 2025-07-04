import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  isGift: boolean;
  giftNote?: string;
  giftPackaging: boolean;
  deliverToFriend: boolean;
  friendDetails?: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, options?: Partial<CartItem>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  updateCartItem: (itemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('giftflare-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('giftflare-cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, options: Partial<CartItem> = {}) => {
    const existingItem = items.find(item => 
      item.product.id === product.id && 
      item.isGift === (options.isGift || false) &&
      item.giftPackaging === (options.giftPackaging || false)
    );

    if (existingItem) {
      updateQuantity(existingItem.id, existingItem.quantity + (options.quantity || 1));
    } else {
      const newItem: CartItem = {
        id: `${product.id}-${Date.now()}`,
        product,
        quantity: options.quantity || 1,
        isGift: options.isGift || false,
        giftNote: options.giftNote || '',
        giftPackaging: options.giftPackaging || false,
        deliverToFriend: options.deliverToFriend || false,
        friendDetails: options.friendDetails
      };
      setItems(prev => [...prev, newItem]);
    }
    setIsCartOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setItems(prev => prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

  const updateCartItem = (itemId: string, updates: Partial<CartItem>) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => {
      let itemTotal = item.product.price * item.quantity;
      if (item.giftPackaging) itemTotal += 50; // ₹50 for gift packaging
      return total + itemTotal;
    }, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCartItem,
      clearCart,
      getTotalPrice,
      getTotalItems,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
};