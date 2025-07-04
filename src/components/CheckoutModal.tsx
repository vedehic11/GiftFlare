import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { 
  X, 
  CreditCard, 
  User, 
  MapPin, 
  Phone, 
  Mail,
  Package,
  Gift,
  CheckCircle,
  Loader
} from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

// Initialize Stripe (replace with your publishable key)
const stripePromise = loadStripe('pk_test_51234567890abcdef...');

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CheckoutFormProps {
  onClose: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [shippingDetails, setShippingDetails] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: user?.city || '',
    pincode: ''
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingDetails(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setIsProcessing(false);
      return;
    }

    try {
      // Create payment method
      const { error: paymentMethodError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: shippingDetails.name,
          email: shippingDetails.email,
          phone: shippingDetails.phone,
          address: {
            line1: shippingDetails.address,
            city: shippingDetails.city,
            postal_code: shippingDetails.pincode,
            country: 'IN'
          }
        }
      });

      if (paymentMethodError) {
        setError(paymentMethodError.message || 'Payment method creation failed');
        setIsProcessing(false);
        return;
      }

      // In a real app, you would send this to your backend to create a payment intent
      // For demo purposes, we'll simulate a successful payment
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulate payment success
      setPaymentSuccess(true);
      clearCart();
      
      // Close modal after showing success
      setTimeout(() => {
        onClose();
        setPaymentSuccess(false);
      }, 3000);

    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-16">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-4">Payment Successful!</h3>
        <p className="text-green-700 mb-6">
          Your order has been placed successfully. You'll receive a confirmation email shortly.
        </p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            Order Total: <span className="font-bold">₹{getTotalPrice().toLocaleString()}</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Order Summary */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <h3 className="font-semibold text-amber-900 mb-3">Order Summary</h3>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-amber-800">
                {item.product.name} × {item.quantity}
                {item.isGift && <Gift className="w-3 h-3 inline ml-1" />}
                {item.giftPackaging && <Package className="w-3 h-3 inline ml-1" />}
              </span>
              <span className="font-medium text-amber-900">
                ₹{((item.product.price * item.quantity) + (item.giftPackaging ? 50 : 0)).toLocaleString()}
              </span>
            </div>
          ))}
          <div className="border-t border-amber-300 pt-2 flex justify-between font-bold">
            <span className="text-amber-900">Total</span>
            <span className="text-amber-600">₹{getTotalPrice().toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Shipping Details */}
      <div>
        <h3 className="font-semibold text-amber-900 mb-4 flex items-center">
          <User className="w-5 h-5 mr-2" />
          Shipping Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={shippingDetails.name}
              onChange={handleShippingChange}
              className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={shippingDetails.email}
              onChange={handleShippingChange}
              className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              required
              value={shippingDetails.phone}
              onChange={handleShippingChange}
              className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">City</label>
            <input
              type="text"
              name="city"
              required
              value={shippingDetails.city}
              onChange={handleShippingChange}
              className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-amber-800 mb-1">Address</label>
            <textarea
              name="address"
              required
              value={shippingDetails.address}
              onChange={handleShippingChange}
              rows={3}
              className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-800 mb-1">Pincode</label>
            <input
              type="text"
              name="pincode"
              required
              value={shippingDetails.pincode}
              onChange={handleShippingChange}
              className="w-full border border-amber-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Friend Delivery Details */}
      {items.some(item => item.deliverToFriend) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Friend's Details (for gift delivery)
          </h3>
          <p className="text-sm text-blue-700 mb-3">
            Some items will be delivered to your friend. Please provide their details.
          </p>
          {/* Add friend details form here */}
        </div>
      )}

      {/* Payment Details */}
      <div>
        <h3 className="font-semibold text-amber-900 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Payment Details
        </h3>
        <div className="border border-amber-300 rounded-lg p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#92400e',
                  '::placeholder': {
                    color: '#d97706',
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {isProcessing ? (
          <>
            <Loader className="w-5 h-5 animate-spin" />
            <span>Processing Payment...</span>
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            <span>Pay ₹{getTotalPrice().toLocaleString()}</span>
          </>
        )}
      </button>
    </form>
  );
};

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center p-6 border-b border-amber-200">
              <h2 className="text-2xl font-bold text-amber-900">Checkout</h2>
              <button
                onClick={onClose}
                className="text-amber-600 hover:text-amber-800 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <Elements stripe={stripePromise}>
                <CheckoutForm onClose={onClose} />
              </Elements>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};