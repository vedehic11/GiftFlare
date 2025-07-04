import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, Truck, X, Grid, List, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { useApp } from '../contexts/AppContext';

export const ShopPage: React.FC = () => {
  const { products } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [showInstantDelivery, setShowInstantDelivery] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');

  const approvedProducts = products.filter(p => p.status === 'approved');
  
  const cities = ['all', ...Array.from(new Set(approvedProducts.map(p => p.city)))];
  const categories = ['all', ...Array.from(new Set(approvedProducts.map(p => p.category)))];

  const filteredProducts = useMemo(() => {
    let filtered = approvedProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCity = selectedCity === 'all' || product.city === selectedCity;
      const matchesDelivery = !showInstantDelivery || product.instantDeliveryEligible;
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

      return matchesSearch && matchesCity && matchesDelivery && matchesCategory;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return filtered;
  }, [approvedProducts, searchTerm, selectedCity, showInstantDelivery, selectedCategory, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-amber-900 mb-6">
            Discover Handmade{' '}
            <span className="text-amber-600">
              Treasures
            </span>
          </h1>
          <p className="text-xl text-amber-700 max-w-2xl mx-auto">
            Browse unique products from verified artisans across India. Each piece tells a story of passion and craftsmanship.
          </p>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-lg border border-amber-100 p-6 md:p-8 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="w-6 h-6 text-amber-500 absolute left-4 top-4" />
            <input
              type="text"
              placeholder="Search for products, makers, or categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all text-lg"
            />
          </div>

          {/* Filter Toggle and View Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-xl hover:bg-amber-200 transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>
              
              <div className="text-sm text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                {filteredProducts.length} of {approvedProducts.length} products
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-amber-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name">Name A-Z</option>
              </select>

              {/* View Mode Toggle */}
              <div className="flex bg-amber-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-amber-600'
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'text-amber-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t border-amber-200 pt-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {/* City Filter */}
                <div>
                  <label className="block text-sm font-semibold text-amber-800 mb-3">
                    <MapPin className="w-4 h-4 inline mr-2" />
                    City
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="w-full border border-amber-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {cities.map(city => (
                      <option key={city} value={city}>
                        {city === 'all' ? 'All Cities' : city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-semibold text-amber-800 mb-3">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-amber-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>
                        {category === 'all' ? 'All Categories' : category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Instant Delivery Filter */}
                <div>
                  <label className="block text-sm font-semibold text-amber-800 mb-3">
                    <Truck className="w-4 h-4 inline mr-2" />
                    Delivery
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer bg-amber-50 p-3 rounded-xl hover:bg-amber-100 transition-colors border border-amber-200">
                    <input
                      type="checkbox"
                      checked={showInstantDelivery}
                      onChange={(e) => setShowInstantDelivery(e.target.checked)}
                      className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                    />
                    <span className="text-sm text-amber-800 font-medium">Instant Delivery Only</span>
                  </label>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCity('all');
                      setSelectedCategory('all');
                      setShowInstantDelivery(false);
                    }}
                    className="flex items-center space-x-2 text-amber-600 hover:text-amber-800 transition-colors bg-amber-50 px-4 py-3 rounded-xl hover:bg-amber-100 w-full justify-center border border-amber-200"
                  >
                    <X className="w-4 h-4" />
                    <span className="font-medium">Clear All</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={`grid gap-8 mb-12 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 lg:grid-cols-2'
          }`}>
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="bg-amber-100 w-32 h-32 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <Search className="w-12 h-12 text-amber-600" />
            </div>
            <h3 className="text-2xl font-bold text-amber-900 mb-4">
              No products found
            </h3>
            <p className="text-amber-700 mb-8 max-w-md mx-auto">
              We couldn't find any products matching your criteria. Try adjusting your search or filter settings.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCity('all');
                setSelectedCategory('all');
                setShowInstantDelivery(false);
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};