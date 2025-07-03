import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, MapPin, Eye, EyeOff, Sparkles, Building } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer' as 'buyer' | 'seller' | 'admin',
    city: 'Mumbai',
    businessName: '',
    description: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData.role === 'seller' && !formData.businessName.trim()) {
      setError('Business name is required for sellers');
      setIsLoading(false);
      return;
    }

    try {
      const success = await register(
        formData.email,
        formData.password,
        formData.name,
        formData.role,
        formData.city,
        formData.role === 'seller' ? formData.businessName : undefined,
        formData.role === 'seller' ? formData.description : undefined
      );
      
      if (success) {
        navigate('/');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:block lg:w-1/2">
        <img
          className="h-full w-full object-cover"
          src="https://images.pexels.com/photos/5624983/pexels-photo-5624983.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Handmade crafts"
        />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 to-orange-50">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full space-y-8"
        >
          <div className="text-center">
            <div className="flex justify-center">
              <div className="bg-amber-600 p-3 rounded-2xl shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-bold text-amber-900">
              Join GiftFlare Community
            </h2>
            <p className="mt-2 text-sm text-amber-700">
              Create your account to start gifting
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['buyer', 'seller', 'admin'] as const).map((roleOption) => (
                  <button
                    key={roleOption}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: roleOption })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      formData.role === roleOption
                        ? 'bg-amber-600 text-white border-2 border-amber-600'
                        : 'bg-white text-amber-700 border-2 border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    {roleOption.charAt(0).toUpperCase() + roleOption.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-amber-800">
                Full Name
              </label>
              <div className="mt-1 relative">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pl-10 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
                <User className="w-5 h-5 text-amber-500 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-amber-800">
                Email address
              </label>
              <div className="mt-1 relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pl-10 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Enter your email"
                />
                <Mail className="w-5 h-5 text-amber-500 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* City */}
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-amber-800">
                City
              </label>
              <div className="mt-1 relative">
                <select
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pl-10 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                <MapPin className="w-5 h-5 text-amber-500 absolute left-3 top-2.5" />
              </div>
            </div>

            {/* Seller-specific fields */}
            {formData.role === 'seller' && (
              <>
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-amber-800">
                    Business Name
                  </label>
                  <div className="mt-1 relative">
                    <input
                      id="businessName"
                      name="businessName"
                      type="text"
                      required
                      value={formData.businessName}
                      onChange={handleChange}
                      className="block w-full px-3 py-2 pl-10 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      placeholder="Enter your business name"
                    />
                    <Building className="w-5 h-5 text-amber-500 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-amber-800">
                    Business Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    placeholder="Describe your business and products"
                  />
                </div>
              </>
            )}

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-amber-800">
                Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pl-10 pr-10 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Create a password"
                />
                <Lock className="w-5 h-5 text-amber-500 absolute left-3 top-2.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-amber-500 hover:text-amber-700"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-amber-800">
                Confirm Password
              </label>
              <div className="mt-1 relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 pl-10 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  placeholder="Confirm your password"
                />
                <Lock className="w-5 h-5 text-amber-500 absolute left-3 top-2.5" />
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-lg font-medium transition-all disabled:opacity-50 shadow-lg"
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </motion.button>
            </div>

            <div className="text-center">
              <p className="text-sm text-amber-700">
                Already have an account?{' '}
                <Link to="/login" className="text-amber-600 hover:text-amber-800 font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};