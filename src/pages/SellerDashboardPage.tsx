import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Upload,
  Camera,
  Truck,
  Star,
  TrendingUp,
  Eye,
  Heart,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { FileUpload } from '../components/FileUpload';

export const SellerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { products, addProduct, deliveryCities } = useApp();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    instantDeliveryEligible: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sellerProducts = products.filter(p => p.sellerId === user?.id);
  const stats = {
    total: sellerProducts.length,
    approved: sellerProducts.filter(p => p.status === 'approved').length,
    pending: sellerProducts.filter(p => p.status === 'pending').length,
    rejected: sellerProducts.filter(p => p.status === 'rejected').length,
    totalViews: sellerProducts.reduce((acc, p) => acc + Math.floor(Math.random() * 100), 0),
    totalRevenue: sellerProducts.filter(p => p.status === 'approved').reduce((acc, p) => acc + p.price, 0)
  };

  const activeDeliveryCities = deliveryCities.filter(c => c.isActive);
  const canOfferInstantDelivery = activeDeliveryCities.some(c => c.name === user?.city);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !imageFile) {
      alert('Please upload a product image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would upload files to a storage service like Supabase Storage
      // For now, we'll create object URLs for demo purposes
      const imageUrl = URL.createObjectURL(imageFile);
      const videoUrl = videoFile ? URL.createObjectURL(videoFile) : undefined;

      const success = await addProduct({
        sellerId: user.id,
        name: productForm.name,
        price: parseInt(productForm.price),
        image: imageUrl,
        description: productForm.description,
        videoUrl: videoUrl,
        city: user.city || 'Mumbai',
        instantDeliveryEligible: productForm.instantDeliveryEligible && canOfferInstantDelivery,
        status: 'pending',
        category: productForm.category,
        tags: productForm.category.toLowerCase().split(' ')
      });

      if (success) {
        setProductForm({
          name: '',
          price: '',
          description: '',
          category: '',
          instantDeliveryEligible: false
        });
        setImageFile(null);
        setVideoFile(null);
        setShowAddProduct(false);
      }
    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-6 lg:mb-0">
              <h1 className="text-4xl font-bold text-amber-900 mb-2">
                Welcome back, {user?.name}
              </h1>
              <p className="text-lg text-amber-700">
                {user?.businessName && (
                  <span className="font-medium text-amber-600">{user.businessName}</span>
                )}
                {user?.businessName && ' • '}
                Manage your products and grow your business
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddProduct(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2 self-start lg:self-auto shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Product</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { 
              label: 'Total Products', 
              value: stats.total, 
              icon: Package, 
              color: 'bg-blue-600',
              change: '+12%',
              changeType: 'positive'
            },
            { 
              label: 'Approved Products', 
              value: stats.approved, 
              icon: CheckCircle, 
              color: 'bg-green-600',
              change: '+8%',
              changeType: 'positive'
            },
            { 
              label: 'Total Views', 
              value: stats.totalViews, 
              icon: Eye, 
              color: 'bg-purple-600',
              change: '+24%',
              changeType: 'positive'
            },
            { 
              label: 'Revenue', 
              value: `₹${stats.totalRevenue.toLocaleString()}`, 
              icon: DollarSign, 
              color: 'bg-amber-600',
              change: '+15%',
              changeType: 'positive'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full ${
                    stat.changeType === 'positive' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-amber-900 mb-1">{stat.value}</p>
                  <p className="text-sm text-amber-700">{stat.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Delivery Status */}
        {canOfferInstantDelivery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-6 rounded-2xl mb-8"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="bg-green-500 p-2 rounded-lg">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <span className="text-green-800 font-semibold text-lg">
                Instant Delivery Available in {user?.city}
              </span>
            </div>
            <p className="text-green-700">
              You can offer instant delivery for your products! This helps increase sales and customer satisfaction.
            </p>
          </motion.div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-amber-900">Pending Review</h3>
            </div>
            <p className="text-2xl font-bold text-amber-900 mb-2">{stats.pending}</p>
            <p className="text-sm text-amber-700">Products awaiting approval</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-pink-100 p-2 rounded-lg">
                <Heart className="w-5 h-5 text-pink-600" />
              </div>
              <h3 className="font-semibold text-amber-900">Customer Favorites</h3>
            </div>
            <p className="text-2xl font-bold text-amber-900 mb-2">{Math.floor(stats.totalViews / 10)}</p>
            <p className="text-sm text-amber-700">Products liked by customers</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-purple-100 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-amber-900">This Month</h3>
            </div>
            <p className="text-2xl font-bold text-amber-900 mb-2">+{Math.floor(Math.random() * 50) + 10}</p>
            <p className="text-sm text-amber-700">New product views</p>
          </motion.div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-200 bg-amber-50">
            <h2 className="text-xl font-semibold text-amber-900">Your Products</h2>
          </div>

          {sellerProducts.length === 0 ? (
            <div className="p-16 text-center">
              <div className="bg-amber-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-amber-900 mb-3">No products yet</h3>
              <p className="text-amber-700 mb-6 max-w-md mx-auto">
                Start showcasing your handmade creations to customers around the world. 
                Upload your first product to get started.
              </p>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg"
              >
                Create Your First Product
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {sellerProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-amber-50 rounded-xl overflow-hidden hover:shadow-md transition-shadow border border-amber-200"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${getStatusColor(product.status)}`}>
                        {getStatusIcon(product.status)}
                        <span className="text-xs font-medium">
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex space-x-2">
                      {product.instantDeliveryEligible && (
                        <div className="bg-green-500 text-white p-1 rounded-full">
                          <Truck className="w-3 h-3" />
                        </div>
                      )}
                      {product.videoUrl && (
                        <div className="bg-purple-500 text-white p-1 rounded-full">
                          <Camera className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-amber-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-amber-700 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-amber-600">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <div className="flex items-center space-x-2 text-xs text-amber-600">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(product.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Add Product Modal */}
        <AnimatePresence>
          {showAddProduct && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-bold text-amber-900">Add New Product</h2>
                    <p className="text-amber-700 mt-1">Showcase your handmade creation to the world</p>
                  </div>
                  <button
                    onClick={() => setShowAddProduct(false)}
                    className="text-amber-600 hover:text-amber-800 p-2"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Product Name */}
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={productForm.name}
                      onChange={handleFormChange}
                      className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="Enter a descriptive product name"
                    />
                  </div>

                  {/* Price and Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-amber-800 mb-2">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="price"
                        required
                        min="1"
                        value={productForm.price}
                        onChange={handleFormChange}
                        className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        placeholder="0"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-amber-800 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        required
                        value={productForm.category}
                        onChange={handleFormChange}
                        className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      >
                        <option value="">Select category</option>
                        <option value="Home Decor">Home Decor</option>
                        <option value="Jewelry">Jewelry</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Art & Crafts">Art & Crafts</option>
                        <option value="Wellness">Wellness</option>
                        <option value="Food & Beverages">Food & Beverages</option>
                        <option value="Pottery">Pottery</option>
                        <option value="Candles">Candles</option>
                        <option value="Textiles">Textiles</option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-amber-800 mb-2">
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={4}
                      value={productForm.description}
                      onChange={handleFormChange}
                      className="w-full border border-amber-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      placeholder="Describe your product, materials used, and what makes it special..."
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <FileUpload
                      type="image"
                      onFileSelect={setImageFile}
                      currentFile={imageFile}
                      placeholder="Upload product image"
                    />
                    
                    <FileUpload
                      type="video"
                      onFileSelect={setVideoFile}
                      currentFile={videoFile}
                      placeholder="Upload product video (optional)"
                    />
                  </div>

                  {/* Instant Delivery Option */}
                  {canOfferInstantDelivery && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <label className="flex items-start space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="instantDeliveryEligible"
                          checked={productForm.instantDeliveryEligible}
                          onChange={handleFormChange}
                          className="mt-1 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                        />
                        <div>
                          <span className="text-sm font-medium text-amber-900">
                            Enable instant delivery for this product
                          </span>
                          <p className="text-xs text-amber-700 mt-1">
                            Products with instant delivery get higher visibility and more sales
                          </p>
                        </div>
                      </label>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex space-x-4 pt-6">
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="flex-1 bg-amber-100 text-amber-700 py-3 px-6 rounded-xl font-semibold hover:bg-amber-200 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || !imageFile}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    >
                      {isSubmitting ? 'Adding Product...' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};