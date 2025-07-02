import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import { LocationProvider } from './contexts/LocationContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LocationDetector } from './components/LocationDetector';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ShopPage } from './pages/ShopPage';
import { GiftSuggesterPage } from './pages/GiftSuggesterPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <AppProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/gift-suggester" element={<GiftSuggesterPage />} />
                
                {/* Protected Routes */}
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
            </Layout>
          </Router>
        </AppProvider>
      </LocationProvider>
    </AuthProvider>
  );
}

export default App;