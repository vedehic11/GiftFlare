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
      color: 'from-rose-500 to-pink-500'
    },
    {
      icon: Truck,
      title: 'Instant Delivery',
      description: 'Get your gifts delivered within hours in supported cities.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Users,
      title: 'Support Small Business',
      description: 'Directly support local artisans and small businesses in your community.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Award,
      title: 'Verified Makers',
      description: 'All our sellers are verified and committed to quality craftsmanship.',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  return (
    <div>
      {/* Hero Video Carousel */}
      <VideoCarousel />

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                GiftFlare?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with passionate makers and find the perfect handcrafted gifts that tell a story.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="text-center p-8 rounded-3xl bg-gradient-to-br from-slate-50 to-white hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products-section" className="py-20 bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Featured{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Creations
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover unique handmade products from our verified makers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all duration-300 group"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* New Features Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Gift Suggester */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-3xl p-8 border border-violet-100"
            >
              <div className="bg-gradient-to-r from-violet-500 to-purple-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                AI Gift Suggester
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Not sure what to gift? Our AI-powered suggester helps you find the perfect handmade gift 
                based on occasion, budget, and recipient preferences.
              </p>
              <Link
                to="/gift-suggester"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-500 to-purple-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
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
              className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100"
            >
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Custom Hamper Builder
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Create personalized gift hampers by combining multiple handmade products. 
                Perfect for special occasions and corporate gifting.
              </p>
              <Link
                to="/hamper-builder"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <span>Build Your Hamper</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Find the Perfect Gift?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 leading-relaxed">
              Join thousands of happy customers who've discovered the joy of giving handmade gifts 
              that truly make a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-2 bg-white text-emerald-600 px-8 py-4 rounded-2xl font-semibold hover:shadow-xl transition-all"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center space-x-2 bg-emerald-500 text-white px-8 py-4 rounded-2xl font-semibold hover:bg-emerald-400 transition-all border-2 border-white/20"
              >
                <span>Become a Seller</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};