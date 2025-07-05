import React, { useState, useEffect } from 'react';
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
  Truck,
  Video,
  Plus,
  Edit,
  Trash2,
  Send,
  Bell,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { useNotifications } from '../contexts/NotificationContext';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface HeroVideo {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  maker_name: string;
  location: string;
  is_active: boolean;
  order_index: number;
}

interface NotificationForm {
  type: 'order' | 'delivery' | 'system' | 'chat' | 'promotion';
  title: string;
  message: string;
  targetUsers: 'all' | 'buyers' | 'sellers';
}

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
  const { createNotification } = useNotifications();
  
  const [activeTab, setActiveTab] = useState('products');
  const [heroVideos, setHeroVideos] = useState<HeroVideo[]>([]);
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<HeroVideo | null>(null);
  const [showNotificationForm, setShowNotificationForm] = useState(false);
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    maker_name: '',
    location: '',
    is_active: true,
    order_index: 1
  });
  const [notificationForm, setNotificationForm] = useState<NotificationForm>({
    type: 'system',
    title: '',
    message: '',
    targetUsers: 'all'
  });

  const pendingProducts = products.filter(p => p.status === 'pending');

  useEffect(() => {
    if (activeTab === 'videos') {
      fetchHeroVideos();
    }
  }, [activeTab]);

  const fetchHeroVideos = async () => {
    try {
      const { data, error } = await supabase
        .from('hero_videos')
        .select('*')
        .order('order_index');

      if (error) {
        console.error('Error fetching hero videos:', error);
        return;
      }

      setHeroVideos(data || []);
    } catch (error) {
      console.error('Error in fetchHeroVideos:', error);
    }
  };

  const handleProductApproval = async (productId: string, status: 'approved' | 'rejected') => {
    const success = await updateProduct(productId, { status });
    if (success) {
      toast.success(`Product ${status} successfully`);
      
      // Send notification to seller
      const product = products.find(p => p.id === productId);
      if (product) {
        await createNotification({
          type: 'system',
          title: `Product ${status}`,
          message: `Your product "${product.name}" has been ${status} by admin.`,
          data: { product_id: productId, status }
        });
      }
    } else {
      toast.error('Failed to update product status');
    }
  };

  const handleDeliveryCityToggle = async (cityId: string, isActive: boolean) => {
    const success = await updateDeliveryCity(cityId, isActive);
    if (success) {
      toast.success(`Delivery city ${isActive ? 'activated' : 'deactivated'}`);
    } else {
      toast.error('Failed to update delivery city');
    }
  };

  const handleThemeChange = async (themeName: string) => {
    const success = await updateTheme(themeName);
    if (success) {
      toast.success('Theme updated successfully');
    } else {
      toast.error('Failed to update theme');
    }
  };

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingVideo) {
        const { error } = await supabase
          .from('hero_videos')
          .update(videoForm)
          .eq('id', editingVideo.id);

        if (error) throw error;
        toast.success('Video updated successfully');
      } else {
        const { error } = await supabase
          .from('hero_videos')
          .insert([videoForm]);

        if (error) throw error;
        toast.success('Video added successfully');
      }

      setVideoForm({
        title: '',
        description: '',
        video_url: '',
        thumbnail_url: '',
        maker_name: '',
        location: '',
        is_active: true,
        order_index: 1
      });
      setShowVideoForm(false);
      setEditingVideo(null);
      fetchHeroVideos();
    } catch (error) {
      console.error('Error saving video:', error);
      toast.error('Failed to save video');
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (confirm('Are you sure you want to delete this video?')) {
      try {
        const { error } = await supabase
          .from('hero_videos')
          .delete()
          .eq('id', videoId);

        if (error) throw error;
        toast.success('Video deleted successfully');
        fetchHeroVideos();
      } catch (error) {
        console.error('Error deleting video:', error);
        toast.error('Failed to delete video');
      }
    }
  };

  const handleEditVideo = (video: HeroVideo) => {
    setEditingVideo(video);
    setVideoForm({
      title: video.title,
      description: video.description,
      video_url: video.video_url,
      thumbnail_url: video.thumbnail_url,
      maker_name: video.maker_name,
      location: video.location,
      is_active: video.is_active,
      order_index: video.order_index
    });
    setShowVideoForm(true);
  };

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Get target users based on selection
      let targetUserIds: string[] = [];
      
      if (notificationForm.targetUsers === 'all') {
        const { data } = await supabase
          .from('profiles')
          .select('id');
        targetUserIds = data?.map(p => p.id) || [];
      } else {
        const { data } = await supabase
          .from('profiles')
          .select('id')
          .eq('role', notificationForm.targetUsers === 'buyers' ? 'buyer' : 'seller');
        targetUserIds = data?.map(p => p.id) || [];
      }

      // Send notification to each user
      const notifications = targetUserIds.map(userId => ({
        user_id: userId,
        type: notificationForm.type,
        title: notificationForm.title,
        message: notificationForm.message,
        data: { sent_by: 'admin', timestamp: new Date().toISOString() }
      }));

      const { error } = await supabase
        .from('notifications')
        .insert(notifications);

      if (error) throw error;

      toast.success(`Notification sent to ${targetUserIds.length} users`);
      setNotificationForm({
        type: 'system',
        title: '',
        message: '',
        targetUsers: 'all'
      });
      setShowNotificationForm(false);
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    }
  };

  const tabs = [
    { id: 'products', name: 'Products', icon: Package },
    { id: 'notifications', name: 'Send Notifications', icon: Bell },
    { id: 'videos', name: 'Hero Videos', icon: Video },
    { id: 'delivery', name: 'Delivery Cities', icon: MapPin },
    { id: 'themes', name: 'Themes', icon: Palette }
  ];

  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'bg-blue-600' },
    { label: 'Pending Reviews', value: pendingProducts.length, icon: Clock, color: 'bg-yellow-600' },
    { label: 'Hero Videos', value: heroVideos.length, icon: Video, color: 'bg-purple-600' },
    { label: 'Delivery Cities', value: deliveryCities.filter(c => c.isActive).length, icon: Truck, color: 'bg-amber-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-amber-900">Admin Dashboard</h1>
          <p className="text-amber-700 mt-1">Manage platform settings and content</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-amber-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-700">{stat.label}</p>
                    <p className="text-2xl font-bold text-amber-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-xl`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-amber-100 overflow-hidden">
          <div className="border-b border-amber-100">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'text-amber-800 border-b-2 border-amber-600 bg-amber-50'
                        : 'text-amber-600 hover:text-amber-800 hover:bg-amber-50'
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
                <h2 className="text-lg font-semibold text-amber-900 mb-4">
                  Product Approvals ({pendingProducts.length} pending)
                </h2>
                
                {pendingProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                    <p className="text-amber-700">No products pending approval</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingProducts.map((product) => (
                      <div key={product.id} className="border border-amber-200 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-20 h-20 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-amber-900">{product.name}</h3>
                            <p className="text-amber-700 text-sm mb-2">{product.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-amber-600">
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

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-amber-900">
                    Send Notifications to Users
                  </h2>
                  <button
                    onClick={() => setShowNotificationForm(true)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Notification</span>
                  </button>
                </div>

                {showNotificationForm && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">Create Notification</h3>
                    <form onSubmit={handleSendNotification} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-amber-800 mb-2">
                            Notification Type
                          </label>
                          <select
                            value={notificationForm.type}
                            onChange={(e) => setNotificationForm({...notificationForm, type: e.target.value as any})}
                            className="w-full border border-amber-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          >
                            <option value="system">System</option>
                            <option value="order">Order</option>
                            <option value="delivery">Delivery</option>
                            <option value="promotion">Promotion</option>
                            <option value="chat">Chat</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-amber-800 mb-2">
                            Target Users
                          </label>
                          <select
                            value={notificationForm.targetUsers}
                            onChange={(e) => setNotificationForm({...notificationForm, targetUsers: e.target.value as any})}
                            className="w-full border border-amber-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          >
                            <option value="all">All Users</option>
                            <option value="buyers">Buyers Only</option>
                            <option value="sellers">Sellers Only</option>
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">
                          Title
                        </label>
                        <input
                          type="text"
                          value={notificationForm.title}
                          onChange={(e) => setNotificationForm({...notificationForm, title: e.target.value})}
                          className="w-full border border-amber-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          placeholder="Notification title"
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">
                          Message
                        </label>
                        <textarea
                          value={notificationForm.message}
                          onChange={(e) => setNotificationForm({...notificationForm, message: e.target.value})}
                          className="w-full border border-amber-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          rows={4}
                          placeholder="Notification message"
                          required
                        />
                      </div>
                      
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center space-x-2"
                        >
                          <Send className="w-4 h-4" />
                          <span>Send Notification</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowNotificationForm(false)}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">Notification Guidelines</h4>
                      <ul className="text-sm text-blue-800 mt-2 space-y-1">
                        <li>• Use clear, concise titles and messages</li>
                        <li>• System notifications for platform updates</li>
                        <li>• Order notifications for order-related updates</li>
                        <li>• Promotion notifications for offers and deals</li>
                        <li>• Delivery notifications for shipping updates</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hero Videos Tab */}
            {activeTab === 'videos' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-amber-900">
                    Hero Videos ({heroVideos.length} total)
                  </h2>
                  <button
                    onClick={() => {
                      setEditingVideo(null);
                      setVideoForm({
                        title: '',
                        description: '',
                        video_url: '',
                        thumbnail_url: '',
                        maker_name: '',
                        location: '',
                        is_active: true,
                        order_index: heroVideos.length + 1
                      });
                      setShowVideoForm(true);
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Video</span>
                  </button>
                </div>

                {showVideoForm && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                    <h3 className="text-lg font-semibold text-amber-900 mb-4">
                      {editingVideo ? 'Edit Video' : 'Add New Video'}
                    </h3>
                    <form onSubmit={handleVideoSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="Video Title"
                          value={videoForm.title}
                          onChange={(e) => setVideoForm({...videoForm, title: e.target.value})}
                          className="border border-amber-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Maker Name"
                          value={videoForm.maker_name}
                          onChange={(e) => setVideoForm({...videoForm, maker_name: e.target.value})}
                          className="border border-amber-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <textarea
                        placeholder="Description"
                        value={videoForm.description}
                        onChange={(e) => setVideoForm({...videoForm, description: e.target.value})}
                        className="w-full border border-amber-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                        rows={3}
                        required
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="url"
                          placeholder="Video/Image URL"
                          value={videoForm.video_url}
                          onChange={(e) => setVideoForm({...videoForm, video_url: e.target.value})}
                          className="border border-amber-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="url"
                          placeholder="Thumbnail URL"
                          value={videoForm.thumbnail_url}
                          onChange={(e) => setVideoForm({...videoForm, thumbnail_url: e.target.value})}
                          className="border border-amber-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Location"
                          value={videoForm.location}
                          onChange={(e) => setVideoForm({...videoForm, location: e.target.value})}
                          className="border border-amber-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="number"
                          placeholder="Order Index"
                          value={videoForm.order_index}
                          onChange={(e) => setVideoForm({...videoForm, order_index: parseInt(e.target.value)})}
                          className="border border-amber-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                          min="1"
                          required
                        />
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={videoForm.is_active}
                            onChange={(e) => setVideoForm({...videoForm, is_active: e.target.checked})}
                            className="rounded border-amber-300 text-amber-600 focus:ring-amber-500"
                          />
                          <span className="text-amber-800">Active</span>
                        </label>
                      </div>
                      <div className="flex space-x-4">
                        <button
                          type="submit"
                          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                          {editingVideo ? 'Update Video' : 'Add Video'}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowVideoForm(false);
                            setEditingVideo(null);
                          }}
                          className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {heroVideos.map((video) => (
                    <div key={video.id} className="border border-amber-200 rounded-lg overflow-hidden">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-amber-900">{video.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            video.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {video.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className="text-sm text-amber-700 mb-2">{video.description}</p>
                        <p className="text-xs text-amber-600 mb-4">
                          by {video.maker_name} • {video.location} • Order: {video.order_index}
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditVideo(video)}
                            className="bg-blue-100 text-blue-700 p-2 rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteVideo(video.id)}
                            className="bg-red-100 text-red-700 p-2 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery Cities Tab */}
            {activeTab === 'delivery' && (
              <div>
                <h2 className="text-lg font-semibold text-amber-900 mb-4">
                  Instant Delivery Cities
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {deliveryCities.map((city) => (
                    <div key={city.id} className="border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <MapPin className="w-5 h-5 text-amber-600" />
                          <span className="font-medium text-amber-900">{city.name}</span>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={city.isActive}
                            onChange={(e) => handleDeliveryCityToggle(city.id, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
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
                <h2 className="text-lg font-semibold text-amber-900 mb-4">
                  Seasonal Themes
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'default', name: 'Default', colors: ['#D97706', '#F59E0B', '#FDE047'] },
                    { id: 'christmas', name: 'Christmas', colors: ['#DC2626', '#16A34A', '#FBBF24'] },
                    { id: 'diwali', name: 'Diwali', colors: ['#F59E0B', '#EA580C', '#DC2626'] }
                  ].map((theme) => (
                    <div key={theme.id} className="border border-amber-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-amber-900">{theme.name}</h3>
                        <div className="flex space-x-2">
                          {theme.colors.map((color, index) => (
                            <div
                              key={index}
                              className="w-6 h-6 rounded-full border-2 border-amber-200"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => handleThemeChange(theme.id)}
                        className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                          currentTheme.name === theme.id
                            ? 'bg-amber-600 text-white'
                            : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
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