import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Package, 
  MapPin, 
  Palette, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Verified,
  Truck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { 
    products, 
    deliveryCities, 
    currentTheme,
    updateProduct, 
    updateDeliveryCity,
    updateTheme 
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('products');

  const pendingProducts = products.filter(p => p.status === 'pending');

  const handleProductApproval = async (productId: string, status: 'approved' | 'rejected') => {
    await updateProduct(productId, { status });
  };

  const handleDeliveryCityToggle = async (cityId: string, isActive: boolean) => {
    await updateDeliveryCity(cityId, isActive);
  };

  const handleThemeChange = async (themeName: string) => {
    await updateTheme(themeName);
  };

  const tabs = [
    { id: 'products', name: 'Products', icon: Package },
    { id: 'delivery', name: 'Delivery Cities', icon: MapPin },
    { id: 'themes', name: 'Themes', icon: Palette }
  ];

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'blue' },
    { label: 'Pending Reviews', value: pendingProducts.length, icon: Clock, color: 'yellow' },
    { label: 'Delivery Cities', value: deliveryCities.filter(c => c.isActive).length, icon: Truck, color: 'purple' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage platform settings and content</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const colorClasses = {
              blue: 'from-blue-500 to-blue-600',
              green: 'from-green-500 to-green-600',
              yellow: 'from-yellow-500 to-yellow-600',
              purple: 'from-purple-500 to-purple-600'
            };
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`bg-gradient-to-r ${colorClasses[stat.color as keyof typeof colorClasses]} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium ${
                      activeTab === tab.id
                        ? 'text-pink-600 border-b-2 border-pink-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Product Approvals ({pendingProducts.length} pending)
                </h2>
                
                {pendingProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No products pending approval</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingProducts.map((product) => (
                      <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>by {product.sellerName}</span>
                              <span>₹{product.price.toLocaleString()}</span>
                              <span>{product.city}</span>
                              {product.instantDeliveryEligible && (
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                  Instant Delivery
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleProductApproval(product.id, 'approved')}
                              className="bg-green-100 text-green-700 p-2 rounded-lg hover:bg-green-200 transition-colors"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleProductApproval(product.id, 'rejected')}
                              className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Delivery Cities Tab */}
            {activeTab === 'delivery' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Instant Delivery Cities
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deliveryCities.map((city) => (
                    <div key={city.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-gray-500" />
                          <span className="font-medium text-gray-900">{city.name}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={city.isActive}
                            onChange={(e) => handleDeliveryCityToggle(city.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Themes Tab */}
            {activeTab === 'themes' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Seasonal Themes
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'default', name: 'Default', colors: ['#EC4899', '#F472B6', '#FDE047'] },
                    { id: 'christmas', name: 'Christmas', colors: ['#DC2626', '#16A34A', '#FBBF24'] },
                    { id: 'diwali', name: 'Diwali', colors: ['#F59E0B', '#EA580C', '#DC2626'] }
                  ].map((theme) => (
                    <div key={theme.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-gray-900">{theme.name}</h3>
                        <div className="flex space-x-2">
                          {theme.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border-2 border-gray-200"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleThemeChange(theme.id)}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          currentTheme.name === theme.id
                            ? 'bg-pink-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {currentTheme.name === theme.id ? 'Active' : 'Activate'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};