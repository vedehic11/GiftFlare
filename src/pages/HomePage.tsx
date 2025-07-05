import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Truck, Users, Award, ArrowRight, Package, Gift } from 'lucide-react';
import { VideoCarousel } from '../components/VideoCarousel';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../contexts/AppContext';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const { products } = useApp();
  const featuredProducts = products.filter(p => p.status === 'approved').slice(0, 6);

  const features = [
    {
      icon: Heart,
      title: 'Handmade with Love',
      description: 'Every product is crafted by passionate artisans who pour their heart into their work.',
      color: 'bg-amber-600'
    },
    {
      icon: Truck,
      title: 'Instant Delivery',
      description: 'Get your gifts delivered within hours in supported cities.',
      color: 'bg-orange-600'
    },
    {
      icon: Users,
      title: 'Support Small Business',
      description: 'Directly support local artisans and small businesses in your community.',
      color: 'bg-yellow-600'
    },
    {
      icon: Award,
      title: 'Verified Makers',
      description: 'All our sellers are verified and committed to quality craftsmanship.',
      color: 'bg-amber-700'
    }
  ];

  return (
    <div>
      {/* Hero Video Carousel */}
      <VideoCarousel />

      {/* Features Section - Mobile Optimized */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-amber-900 mb-3 md:mb-4">
              Why Choose{' '}
              <span className="text-amber-600">
                GiftFlare?
              </span>
            </h2>
            <p className="text-base md:text-lg text-amber-700 max-w-2xl mx-auto">
              Connect with passionate makers and find the perfect handcrafted gifts that tell a story.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2 }}
                  className="text-center p-4 md:p-6 rounded-2xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 hover:shadow-lg transition-all duration-300 border border-amber-100"
                >
                  <div className={`${feature.color} w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg`}>
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-base md:text-lg font-bold text-amber-900 mb-2 md:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-sm md:text-base text-amber-700 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products - Mobile Optimized */}
      <section id="products-section" className="py-8 md:py-16 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-amber-900 mb-3 md:mb-4">
              Featured{' '}
              <span className="text-amber-600">
                Creations
              </span>
            </h2>
            <p className="text-base md:text-lg text-amber-700 max-w-2xl mx-auto">
              Discover unique handmade products from our verified makers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 md:space-x-3 bg-amber-600 hover:bg-amber-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold transition-all duration-300 group shadow-lg"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Features Showcase - Mobile Optimized */}
      <section className="py-8 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-center">
            {/* Gift Suggester */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-4 md:p-6 border border-amber-100"
            >
              <div className="bg-amber-600 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                <Gift className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-2 md:mb-3">
                AI Gift Suggester
              </h3>
              <p className="text-sm md:text-base text-amber-700 mb-3 md:mb-4 leading-relaxed">
                Not sure what to gift? Our AI-powered suggester helps you find the perfect handmade gift 
                based on occasion, budget, and recipient preferences.
              </p>
              <Link
                to="/gift-suggester"
                className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all shadow-lg"
              >
                <span>Try Gift Suggester</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Hamper Builder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-4 md:p-6 border border-orange-100"
            >
              <div className="bg-orange-600 w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center mb-3 md:mb-4">
                <Package className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-amber-900 mb-2 md:mb-3">
                Custom Hamper Builder
              </h3>
              <p className="text-sm md:text-base text-amber-700 mb-3 md:mb-4 leading-relaxed">
                Create personalized gift hampers by combining multiple handmade products. 
                Perfect for special occasions and corporate gifting.
              </p>
              <Link
                to="/hamper-builder"
                className="inline-flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold transition-all shadow-lg"
              >
                <span>Build Your Hamper</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action - Mobile Optimized */}
      <section className="py-8 md:py-16 bg-amber-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3 md:mb-4">
              Ready to Find the Perfect Gift?
            </h2>
            <p className="text-base md:text-lg text-amber-100 mb-4 md:mb-6 leading-relaxed">
              Join thousands of happy customers who've discovered the joy of giving handmade gifts 
              that truly make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-2 bg-white text-amber-600 px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold hover:shadow-xl transition-all"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-amber-700 hover:bg-amber-800 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl font-semibold transition-all border-2 border-amber-500"
              >
                <span>Become a Seller</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};