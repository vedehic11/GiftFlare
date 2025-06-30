import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Truck, Users, Award, ArrowRight } from 'lucide-react';
import { VideoCarousel } from '../components/VideoCarousel';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../contexts/AppContext';

export const HomePage: React.FC = () => {
  const { products } = useApp();
  const featuredProducts = products.filter(p => p.status === 'approved').slice(0, 6);

  const features = [
    {
      icon: Heart,
      title: 'Handmade with Love',
      description: 'Every product is crafted by passionate artisans who pour their heart into their work.'
    },
    {
      icon: Truck,
      title: 'Instant Delivery',
      description: 'Get your gifts delivered within hours in supported cities.'
    },
    {
      icon: Users,
      title: 'Support Small Business',
      description: 'Directly support local artisans and small businesses in your community.'
    },
    {
      icon: Award,
      title: 'Verified Makers',
      description: 'All our sellers are verified and committed to quality craftsmanship.'
    }
  ];

  return (
    <div>
      {/* Hero Video Carousel */}
      <VideoCarousel />

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose GiftFlare?
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
                  className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 hover:shadow-lg transition-shadow"
                >
                  <div className="bg-gradient-to-r from-pink-500 to-rose-500 w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="products-section" className="py-16 bg-gradient-to-br from-pink-50 via-white to-rose-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Featured Creations
            </h2>
            <p className="text-xl text-gray-600">
              Discover unique handmade products from our verified makers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
            <motion.a
              href="/shop"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-rose-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Find the Perfect Gift?
            </h2>
            <p className="text-xl text-pink-100 mb-8">
              Let our AI gift suggester help you discover something special for your loved ones.
            </p>
            <motion.a
              href="/gift-suggester"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-white text-pink-600 px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-shadow"
            >
              <span>Try Gift Suggester</span>
              <ArrowRight className="w-5 h-5" />
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
};