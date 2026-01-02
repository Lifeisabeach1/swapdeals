// components/LoginForm.jsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { X, Lock, User, CheckCircle, Loader2, Mail } from 'lucide-react';

export default function LoginForm({ isOpen, onClose, onSwitchToRegister }) {
  const { login, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '',
    rememberMe: false 
  });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Clear field-specific error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    // Clear API error
    clearError();
  };

  const validate = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'E-post krävs';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Giltig e-postadress krävs';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Lösenord krävs';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Lösenordet måste vara minst 6 tecken';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();

    // Validate form
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit login
    const result = await login({
      email: formData.email.trim().toLowerCase(),
      password: formData.password
    });

    if (result) {
      setLoggedInUser(result.user);
      setShowSuccess(true);
      setFormData({ email: '', password: '', rememberMe: false });
      setErrors({});
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  if (!isOpen && !showSuccess) return null;

  // Success Modal
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-2xl w-full max-w-md p-8 animate-in zoom-in duration-300">
          <div className="text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full mb-6 shadow-lg animate-in zoom-in duration-500">
              <CheckCircle className="w-10 h-10 text-white" strokeWidth={2.5} />
            </div>
            
            {/* Welcome Message */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              Välkommen tillbaka! 👋
            </h3>
            <p className="text-gray-600 mb-6 text-base">
              Du har loggat in på ditt konto.
            </p>

            {/* User Info Card */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-green-200/50 shadow-sm mb-8">
              <div className="flex items-center justify-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-left">
                  <div className="text-xs text-gray-600 font-medium">Inloggad som</div>
                  <div className="text-sm font-bold text-green-700">
                    {loggedInUser?.username || loggedInUser?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleSuccessClose}
              className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              Fortsätt
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Login Form
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md animate-in zoom-in duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 flex items-center justify-between p-6 border-b border-gray-200 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl shadow-sm">
              <Lock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Välkommen tillbaka</h2>
              <p className="text-sm text-gray-600">Logga in på ditt konto</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* API Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-2 animate-in slide-in-from-top duration-300">
              <span className="text-red-500 font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              E-postadress <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full pl-11 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="din@email.se"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <span>•</span> {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Lösenord <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className={`w-full pl-11 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-50 disabled:cursor-not-allowed ${
                  errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ditt lösenord"
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <p className="text-red-600 text-sm mt-1.5 flex items-center gap-1">
                <span>•</span> {errors.password}
              </p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                disabled={isLoading}
                className="h-4 w-4 rounded text-green-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 border-gray-300 disabled:cursor-not-allowed transition-colors" 
              />
              <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
                Kom ihåg mig
              </span>
            </label>
            <button 
              type="button" 
              className="text-green-600 hover:text-green-700 font-medium hover:underline transition-colors"
              onClick={() => {
                // TODO: Implement forgot password
                alert('Glömt lösenord-funktionen kommer snart!');
              }}
            >
              Glömt lösenord?
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Avbryt
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Loggar in...</span>
                </>
              ) : (
                'Logga in'
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <p className="text-sm text-gray-600 text-center">
            Har inget konto?{' '}
            <button
              onClick={() => {
                onClose();
                setTimeout(() => onSwitchToRegister?.(), 100);
              }}
              disabled={isLoading}
              className="text-green-600 hover:text-green-700 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Skapa ett här
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}