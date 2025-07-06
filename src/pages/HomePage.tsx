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
      color: 'bg-rose-600'
    },
    {
      icon: Truck,
      title: 'Instant Delivery',
      description: 'Get your gifts delivered within hours in supported cities.',
      color: 'bg-blue-600'
    },
    {
      icon: Users,
      title: 'Support Small Business',
      description: 'Directly support local artisans and small businesses in your community.',
      color: 'bg-emerald-600'
    },
    {
      icon: Award,
      title: 'Verified Makers',
      description: 'All our sellers are verified and committed to quality craftsmanship.',
      color: 'bg-indigo-600'
    }
  ];

  return (
    <div>
      {/* Hero Video Carousel */}
      <VideoCarousel />

      {/* Features Section - Mobile Optimized */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                GiftFlare?
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Connect with passionate makers and find the perfect handcrafted gifts that tell a story.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="text-center p-8 md:p-10 rounded-3xl bg-gradient-to-br from-slate-50 to-blue-50 hover:shadow-xl transition-all duration-300 border border-slate-200"
                >
                  <div className={`${feature.color} w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-base md:text-lg text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products - Mobile Optimized */}
      <section id="products-section" className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 md:mb-20"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
              Featured{' '}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Creations
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
              Discover unique handmade products from our verified makers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-16 md:mb-20">
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
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 md:px-12 py-4 md:py-5 rounded-2xl font-semibold transition-all duration-300 group shadow-xl text-lg"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Features Showcase - Mobile Optimized */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Gift Suggester */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 md:p-10 border border-blue-200"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mb-6">
                <Gift className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                AI Gift Suggester
              </h3>
              <p className="text-base md:text-lg text-slate-600 mb-6 leading-relaxed">
                Not sure what to gift? Our AI-powered suggester helps you find the perfect handmade gift 
                based on occasion, budget, and recipient preferences.
              </p>
              <Link
                to="/gift-suggester"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-semibold transition-all shadow-lg"
              >
                <span>Try Gift Suggester</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </motion.div>

            {/* Hamper Builder */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 md:p-10 border border-emerald-200"
            >
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center mb-6">
                <Package className="w-10 h-10 md:w-12 md:h-12 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                Custom Hamper Builder
              </h3>
              <p className="text-base md:text-lg text-slate-600 mb-6 leading-relaxed">
                Create personalized gift hampers by combining multiple handmade products. 
                Perfect for special occasions and corporate gifting.
              </p>
              <Link
                to="/hamper-builder"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-8 md:px-10 py-3 md:py-4 rounded-xl font-semibold transition-all shadow-lg"
              >
                <span>Build Your Hamper</span>
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action - Mobile Optimized */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
              Ready to Find the Perfect Gift?
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed">
              Join thousands of happy customers who've discovered the joy of giving handmade gifts 
              that truly make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-10 md:px-12 py-4 md:py-5 rounded-2xl font-semibold hover:shadow-xl transition-all text-lg"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white px-10 md:px-12 py-4 md:py-5 rounded-2xl font-semibold transition-all border-2 border-blue-500 text-lg"
              >
                <span>Become a Seller</span>
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};