import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Heart, 
  User, 
  Gift, 
  LogOut, 
  Menu, 
  X,
  Sparkles,
  Package,
  History,
  ShoppingBag
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CartIcon } from './CartIcon';
import { CartSidebar } from './CartSidebar';
import { NotificationCenter } from './NotificationCenter';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getBuyerNavigation = () => [
    { name: 'Home', href: '/', icon: Heart },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Gift Suggester', href: '/gift-suggester', icon: Gift },
    { name: 'Hamper Builder', href: '/hamper-builder', icon: Package },
    ...(user ? [{ name: 'Orders', href: '/orders', icon: History }] : [])
  ];

  const getSellerNavigation = () => [
    { name: 'Dashboard', href: '/seller/dashboard', icon: User },
    { name: 'Orders', href: '/orders', icon: History },
  ];

  const getAdminNavigation = () => [
    { name: 'Dashboard', href: '/admin/dashboard', icon: User },
    { name: 'Orders', href: '/orders', icon: History },
  ];

  const getNavigation = () => {
    if (!user) return getBuyerNavigation();
    switch (user.role) {
      case 'seller': return getSellerNavigation();
      case 'admin': return getAdminNavigation();
      default: return getBuyerNavigation();
    }
  };

  const navigation = getNavigation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 md:space-x-3">
              <motion.div
                whileHover={{ rotate: 15, scale: 1.05 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 md:p-2.5 rounded-2xl shadow-lg"
              >
                <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-white" />
              </motion.div>
              <div>
                <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  GiftFlare
                </span>
                <div className="text-xs text-slate-600 font-medium hidden md:block">Handmade with ❤️</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center space-x-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                        : 'text-slate-700 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium text-sm md:text-base">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* User Menu */}
            <div className="hidden lg:flex items-center space-x-3 md:space-x-4">
              {/* Notifications */}
              {user && <NotificationCenter />}
              
              {/* Cart Icon */}
              {(!user || user.role === 'buyer') && <CartIcon />}
              
              {user ? (
                <div className="flex items-center space-x-3 md:space-x-4">
                  <div className="flex items-center space-x-2 md:space-x-3 bg-slate-100 rounded-xl px-3 md:px-4 py-2 border border-slate-200">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-1.5 md:p-2 rounded-lg">
                      <User className="w-3 h-3 md:w-4 md:h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xs md:text-sm font-semibold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-600 capitalize">{user.role}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2 md:p-2.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut className="w-4 h-4 md:w-5 md:h-5" />
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-slate-700 hover:text-slate-800 font-semibold px-3 md:px-4 py-2 rounded-xl hover:bg-slate-100 transition-all text-sm md:text-base"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 md:px-6 py-2 md:py-2.5 rounded-xl transition-all font-semibold shadow-lg text-sm md:text-base"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden flex items-center space-x-2">
              {user && <NotificationCenter />}
              {(!user || user.role === 'buyer') && <CartIcon />}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white border-t border-slate-200 px-4 py-4 shadow-lg"
          >
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                        : 'text-slate-700 hover:text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
              
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-700 hover:text-red-600 hover:bg-red-50 w-full transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </button>
              ) : (
                <div className="space-y-2 pt-2 border-t border-slate-200">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="block px-4 py-3 text-slate-700 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-medium transition-all"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="block bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-3 rounded-xl text-center font-semibold transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </nav>
          </motion.div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Cart Sidebar */}
      <CartSidebar />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">GiftFlare</span>
              </div>
              <p className="text-slate-700 mb-4 max-w-md text-sm md:text-base">
                Connecting passionate makers with thoughtful gift-givers. Every purchase supports 
                local artisans and their handcrafted dreams.
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium border border-blue-200">
                  🌱 Sustainable
                </div>
                <div className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium border border-indigo-200">
                  🤝 Community-driven
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/shop" className="text-slate-700 hover:text-slate-800 transition-colors text-sm">Browse Products</Link></li>
                <li><Link to="/gift-suggester" className="text-slate-700 hover:text-slate-800 transition-colors text-sm">Gift Suggester</Link></li>
                <li><Link to="/hamper-builder" className="text-slate-700 hover:text-slate-800 transition-colors text-sm">Build Hamper</Link></li>
                <li><Link to="/register" className="text-slate-700 hover:text-slate-800 transition-colors text-sm">Become a Seller</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-slate-900 mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-700 hover:text-slate-800 transition-colors text-sm">Help Center</a></li>
                <li><a href="#" className="text-slate-700 hover:text-slate-800 transition-colors text-sm">Shipping Info</a></li>
                <li><a href="#" className="text-slate-700 hover:text-slate-800 transition-colors text-sm">Returns</a></li>
                <li><a href="#" className="text-slate-700 hover:text-slate-800 transition-colors text-sm">Contact Us</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-200 mt-6 md:mt-8 pt-6 md:pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-slate-600 mb-4 md:mb-0">
              © 2024 GiftFlare. Made with ❤️ for artisans everywhere.
            </p>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <a href="#" className="hover:text-slate-800 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-800 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};