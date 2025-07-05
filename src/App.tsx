import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { LocationProvider } from './contexts/LocationContext';
import { CartProvider } from './contexts/CartContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LocationDetector } from './components/LocationDetector';
import { SupportChat } from './components/SupportChat';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ShopPage } from './pages/ShopPage';
import { GiftSuggesterPage } from './pages/GiftSuggesterPage';
import { HamperBuilderPage } from './pages/HamperBuilderPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <AppProvider>
          <CartProvider>
            <NotificationProvider>
              <Router>
                <Layout>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/gift-suggester" element={<GiftSuggesterPage />} />
                    <Route path="/hamper-builder" element={<HamperBuilderPage />} />
                    
                    {/* Protected Routes */}
                    <Route 
                      path="/orders" 
                      element={
                        <ProtectedRoute>
                          <OrderHistoryPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/seller/dashboard" 
                      element={
                        <ProtectedRoute requiredRole="seller">
                          <SellerDashboardPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/admin/dashboard" 
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <AdminDashboardPage />
                        </ProtectedRoute>
                      } 
                    />
                  </Routes>
                  <LocationDetector />
                  <SupportChat />
                </Layout>
                
                {/* Toast Notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#fef3c7',
                      color: '#92400e',
                      border: '1px solid #f59e0b',
                    },
                    success: {
                      style: {
                        background: '#d1fae5',
                        color: '#065f46',
                        border: '1px solid #10b981',
                      },
                    },
                    error: {
                      style: {
                        background: '#fee2e2',
                        color: '#991b1b',
                        border: '1px solid #ef4444',
                      },
                    },
                  }}
                />
              </Router>
            </NotificationProvider>
          </CartProvider>
        </AppProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;